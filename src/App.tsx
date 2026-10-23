/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ChatMessage,
  MemoryItem,
  TaskItem,
  ReminderItem,
  DailyRoutine,
  AvatarState,
  VoiceSettings,
  ModelSettings,
  PrivacySettings,
  UserProfile,
  ToolCallExecution,
} from './types/assistant';
import { StorageService } from './services/storageService';
import { AIService } from './services/aiService';
import { ttsService } from './services/ttsService';
import { sttService } from './services/sttService';

import { JarvisDashboard } from './components/HUD/JarvisDashboard';
import { VoiceOverlay } from './components/Voice/VoiceOverlay';
import { ChatView } from './components/Chat/ChatView';
import { MemoryManager } from './components/Memory/MemoryManager';
import { TasksRemindersView } from './components/Tasks/TasksRemindersView';
import { DocumentChatView } from './components/DocumentChat/DocumentChatView';
import { SettingsModal } from './components/Settings/SettingsModal';
import { AppsCalendarView } from './components/Apps/AppsCalendarView';
import { AndroidApkModal } from './components/Android/AndroidApkModal';

export type MasterView =
  | 'hud'
  | 'chat'
  | 'voice'
  | 'memory'
  | 'files'
  | 'tasks'
  | 'calendar'
  | 'settings';

export default function App() {
  // Persistent data state
  const [messages, setMessages] = useState<ChatMessage[]>(() => StorageService.getMessages());
  const [memories, setMemories] = useState<MemoryItem[]>(() => StorageService.getMemories());
  const [tasks, setTasks] = useState<TaskItem[]>(() => StorageService.getTasks());
  const [reminders, setReminders] = useState<ReminderItem[]>(() => StorageService.getReminders());
  const [routines, setRoutines] = useState<DailyRoutine[]>(() => StorageService.getRoutines());
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() =>
    StorageService.getVoiceSettings()
  );
  const [modelSettings, setModelSettings] = useState<ModelSettings>(() =>
    StorageService.getModelSettings()
  );
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() =>
    StorageService.getPrivacySettings()
  );

  // App Master Navigation: Starts on 'hud' matching the reference image!
  const [activeView, setActiveView] = useState<MasterView>('hud');

  // Reactor & Voice States
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastReply, setLastReply] = useState('');

  // Modals
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    StorageService.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    StorageService.saveMemories(memories);
  }, [memories]);

  useEffect(() => {
    StorageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    StorageService.saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    StorageService.saveRoutines(routines);
  }, [routines]);

  // Audio amplitude & speech state bindings
  useEffect(() => {
    ttsService.onAmplitudeChange = (amp) => {
      setAmplitude(amp);
    };

    ttsService.onStateChange = (speaking) => {
      setIsSpeaking(speaking);
      if (!speaking && avatarState === 'speaking') {
        setAvatarState('idle');
      }
    };

    sttService.onListeningChange = (listening) => {
      setIsListening(listening);
      if (listening) {
        setAvatarState('listening');
      } else if (!isSpeaking && avatarState === 'listening') {
        setAvatarState('idle');
      }
    };

    sttService.onResult = (transcript, isFinal) => {
      setLiveTranscript(transcript);
      if (isFinal && transcript.trim()) {
        handleUserSendMessage(transcript.trim());
        setLiveTranscript('');
      }
    };

    sttService.onWakeWordDetected = () => {
      setIsVoiceOverlayOpen(true);
      speakResponse('Haanji, main sun raha hoon! Bataiye kya kaam hai?');
    };

    return () => {
      ttsService.stop();
      sttService.stop();
    };
  }, [voiceSettings, avatarState, isSpeaking]);

  // Speech response helper
  const speakResponse = async (text: string) => {
    setLastReply(text);
    setAvatarState('speaking');
    try {
      await ttsService.speak(text, voiceSettings);
    } catch (e) {
      console.warn('TTS error:', e);
      setAvatarState('idle');
    }
  };

  // Interrupt speech immediately
  const handleInterruptSpeech = () => {
    ttsService.stop();
    setIsSpeaking(false);
    setAvatarState('idle');
  };

  // Chat message submission
  const handleUserSendMessage = async (text: string, fileAttachment?: any) => {
    if (!text.trim() && !fileAttachment) return;

    handleInterruptSpeech();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp,
      fileAttachment: fileAttachment
        ? {
            name: fileAttachment.name,
            size: fileAttachment.size,
            type: fileAttachment.mimeType,
          }
        : undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsProcessing(true);
    setAvatarState('thinking');

    try {
      const response = await AIService.sendMessage({
        messages: newMessages,
        profile,
        memories: privacySettings.memoryEnabled ? memories : [],
        tasks,
        model: modelSettings.model,
        fileAttachment,
      });

      const executedToolCalls: ToolCallExecution[] = [];

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          const args = call.args || {};
          let status: ToolCallExecution['status'] = 'executed';

          if (call.name === 'create_task') {
            StorageService.addTask(args.title, args.priority || 'medium', args.dueDate);
            setTasks(StorageService.getTasks());
          } else if (call.name === 'create_reminder') {
            StorageService.addReminder(args.reminderText, args.time);
            setReminders(StorageService.getReminders());
          } else if (call.name === 'save_personal_memory') {
            if (privacySettings.memoryEnabled) {
              StorageService.addMemory(args.fact, args.category || 'personal');
              setMemories(StorageService.getMemories());
            }
          } else if (call.name === 'open_screen') {
            if (args.screen) {
              setActiveView(args.screen as MasterView);
            }
          } else if (call.name === 'prepare_email_draft') {
            status = 'pending';
          }

          executedToolCalls.push({
            name: call.name,
            args,
            status,
          });
        }
      }

      const assistantMessage: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarState: (response.avatarState as AvatarState) || 'speaking',
        toolCalls: executedToolCalls.length > 0 ? executedToolCalls : undefined,
      };

      setMessages([...newMessages, assistantMessage]);
      setAvatarState((response.avatarState as AvatarState) || 'speaking');

      if (voiceSettings.autoSpeak && response.text) {
        speakResponse(response.text);
      } else {
        setTimeout(() => setAvatarState('idle'), 2500);
      }
    } catch (err: any) {
      console.error('Failed to get Vivek response:', err);
      setAvatarState('error');

      const errorMessage: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to connect to Vivek AI server'}. Agar API key set nahi hai, toh AI Studio Secrets panel me GEMINI_API_KEY attach karein.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarState: 'error',
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice toggle
  const handleToggleVoice = () => {
    if (isListening) {
      sttService.stop();
    } else {
      sttService.start({
        language: voiceSettings.preferredLanguage === 'hindi' ? 'hi-IN' : 'en-IN',
        wakeWordEnabled: voiceSettings.wakeWordEnabled,
        wakeWord: voiceSettings.wakeWord,
      });
    }
  };

  // Quick Actions from HUD
  const handleQuickAction = (action: string) => {
    if (action === 'open_apps') {
      setActiveView('calendar');
    } else if (action === 'search_web') {
      setActiveView('chat');
      handleUserSendMessage('Vivek, can you search the web and summarize latest tech and AI updates today?');
    } else if (action === 'create_note') {
      setActiveView('chat');
      handleUserSendMessage('Create a quick note for me: ');
    } else if (action === 'set_reminder') {
      setActiveView('tasks');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-slate-100 font-sans antialiased overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* HUD DASHBOARD VIEW (Reference Image Top Master Screen) */}
      {activeView === 'hud' && (
        <JarvisDashboard
          avatarState={avatarState}
          isListening={isListening}
          isSpeaking={isSpeaking}
          amplitude={amplitude}
          tasks={tasks}
          memories={memories}
          voiceSettings={voiceSettings}
          profile={profile}
          onSelectTab={(tab) => {
            if (tab === 'voice') {
              setIsVoiceOverlayOpen(true);
            } else if (tab === 'settings') {
              setIsSettingsOpen(true);
            } else {
              setActiveView(tab as MasterView);
            }
          }}
          onToggleMic={handleToggleVoice}
          onInterruptSpeech={handleInterruptSpeech}
          onToggleTask={(id) => {
            StorageService.toggleTask(id);
            setTasks(StorageService.getTasks());
          }}
          onQuickAction={handleQuickAction}
          onOpenVoiceMode={() => setIsVoiceOverlayOpen(true)}
        />
      )}

      {/* DEDICATED CHAT SCREEN (Reference Image Bottom Screen 2) */}
      {activeView === 'chat' && (
        <ChatView
          messages={messages}
          isProcessing={isProcessing}
          isListening={isListening}
          isSpeaking={isSpeaking}
          onSendMessage={handleUserSendMessage}
          onOpenVoiceMode={() => setIsVoiceOverlayOpen(true)}
          onInterruptSpeech={handleInterruptSpeech}
          onSpeakText={speakResponse}
          onBackToDashboard={() => setActiveView('hud')}
          onToolConfirm={(tool, confirm) => {
            if (tool.name === 'prepare_email_draft' && confirm) {
              alert(`Email approved for ${tool.args.recipient || 'recipient'}`);
            }
          }}
        />
      )}

      {/* DEDICATED MEMORY SCREEN (Reference Image Bottom Screen 3) */}
      {activeView === 'memory' && (
        <MemoryManager
          memories={memories}
          privacySettings={privacySettings}
          onAddMemory={(fact, cat) => {
            StorageService.addMemory(fact, cat);
            setMemories(StorageService.getMemories());
          }}
          onDeleteMemory={(id) => {
            StorageService.deleteMemory(id);
            setMemories(StorageService.getMemories());
          }}
          onClearAllMemories={() => {
            StorageService.clearMemories();
            setMemories([]);
          }}
          onToggleMemoryEnabled={(enabled) => {
            const updated = { ...privacySettings, memoryEnabled: enabled };
            setPrivacySettings(updated);
            StorageService.savePrivacySettings(updated);
          }}
          onClearChatHistory={() => {
            StorageService.clearMessages();
            setMessages(StorageService.getMessages());
          }}
          onExportData={() => {
            const json = StorageService.exportAllData();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vivek-ai-backup.json`;
            a.click();
          }}
          onBackToDashboard={() => setActiveView('hud')}
        />
      )}

      {/* DEDICATED FILES SCREEN (Reference Image Bottom Screen 4) */}
      {activeView === 'files' && (
        <DocumentChatView
          onAnalyzeDocument={(docName, docText, instruction) => {
            setActiveView('chat');
            handleUserSendMessage(instruction, {
              name: docName,
              size: docText.length,
              mimeType: 'text/plain',
              extractedText: docText,
            });
          }}
          onBackToDashboard={() => setActiveView('hud')}
        />
      )}

      {/* DEDICATED TASKS & REMINDERS SCREEN (Reference Image Bottom Screen 5) */}
      {activeView === 'tasks' && (
        <TasksRemindersView
          tasks={tasks}
          reminders={reminders}
          routines={routines}
          onAddTask={(title, priority, dueDate) => {
            StorageService.addTask(title, priority, dueDate);
            setTasks(StorageService.getTasks());
          }}
          onToggleTask={(id) => {
            StorageService.toggleTask(id);
            setTasks(StorageService.getTasks());
          }}
          onDeleteTask={(id) => {
            StorageService.deleteTask(id);
            setTasks(StorageService.getTasks());
          }}
          onAddReminder={(text, time) => {
            StorageService.addReminder(text, time);
            setReminders(StorageService.getReminders());
          }}
          onDismissReminder={(id) => {
            StorageService.dismissReminder(id);
            setReminders(StorageService.getReminders());
          }}
          onToggleRoutine={(id) => {
            StorageService.toggleRoutine(id);
            setRoutines(StorageService.getRoutines());
          }}
          onRunRoutineNow={(routine) => {
            setActiveView('chat');
            handleUserSendMessage(`Run routine: ${routine.title}`);
          }}
          onBackToDashboard={() => setActiveView('hud')}
        />
      )}

      {/* DEDICATED CALENDAR & APPS SCREEN */}
      {activeView === 'calendar' && (
        <AppsCalendarView
          onBackToDashboard={() => setActiveView('hud')}
          onScheduleEvent={(title, time) => {
            setActiveView('chat');
            handleUserSendMessage(`Schedule calendar meeting: ${title} at ${time}`);
          }}
          onDraftEmail={(to, subject, body) => {
            setActiveView('chat');
            handleUserSendMessage(`Prepare email to ${to} with subject "${subject}": ${body}`);
          }}
        />
      )}

      {/* FULL-SCREEN VOICE CONVERSATION OVERLAY (Reference Image Bottom Screen 1) */}
      <VoiceOverlay
        isOpen={isVoiceOverlayOpen}
        onClose={() => setIsVoiceOverlayOpen(false)}
        avatarState={avatarState}
        isListening={isListening}
        isSpeaking={isSpeaking}
        amplitude={amplitude}
        liveTranscript={liveTranscript}
        lastReply={lastReply}
        voiceSettings={voiceSettings}
        onStartListening={() => {
          sttService.start({
            language: voiceSettings.preferredLanguage === 'hindi' ? 'hi-IN' : 'en-IN',
            wakeWordEnabled: voiceSettings.wakeWordEnabled,
            wakeWord: voiceSettings.wakeWord,
          });
        }}
        onStopListening={() => sttService.stop()}
        onInterruptSpeech={handleInterruptSpeech}
        onReplaySpeech={() => {
          if (lastReply) speakResponse(lastReply);
        }}
        onUpdateLanguage={(lang) => {
          const updated = { ...voiceSettings, preferredLanguage: lang };
          setVoiceSettings(updated);
          StorageService.saveVoiceSettings(updated);
        }}
        onUpdateVoiceEngine={(engine) => {
          const updated = { ...voiceSettings, ttsEngine: engine };
          setVoiceSettings(updated);
          StorageService.saveVoiceSettings(updated);
        }}
      />

      {/* DEDICATED SETTINGS SCREEN (Reference Image Bottom Screen 6) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceSettings={voiceSettings}
        modelSettings={modelSettings}
        privacySettings={privacySettings}
        profile={profile}
        onSaveVoiceSettings={(s) => {
          setVoiceSettings(s);
          StorageService.saveVoiceSettings(s);
        }}
        onSaveModelSettings={(s) => {
          setModelSettings(s);
          StorageService.saveModelSettings(s);
        }}
        onSavePrivacySettings={(s) => {
          setPrivacySettings(s);
          StorageService.savePrivacySettings(s);
        }}
        onSaveProfile={(p) => {
          setProfile(p);
          StorageService.saveProfile(p);
        }}
        onExportData={() => {
          const json = StorageService.exportAllData();
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `vivek-ai-backup.json`;
          a.click();
        }}
        onResetAllData={() => {
          StorageService.resetAllData();
          setMessages(StorageService.getMessages());
          setMemories(StorageService.getMemories());
          setTasks(StorageService.getTasks());
          setReminders(StorageService.getReminders());
          setRoutines(StorageService.getRoutines());
          setProfile(StorageService.getProfile());
          setVoiceSettings(StorageService.getVoiceSettings());
          setModelSettings(StorageService.getModelSettings());
          setPrivacySettings(StorageService.getPrivacySettings());
        }}
        onOpenApkModal={() => {
          setIsSettingsOpen(false);
          setIsApkModalOpen(true);
        }}
        onBackToDashboard={() => {
          setIsSettingsOpen(false);
          setActiveView('hud');
        }}
      />

      {/* ANDROID APK PIPELINE GUIDE MODAL */}
      <AndroidApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
