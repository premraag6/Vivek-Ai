import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Volume2,
  Cpu,
  Shield,
  Grid,
  Bell,
  Lock,
  Info,
  ChevronRight,
  User,
  Check,
  RotateCcw,
  Smartphone,
  Download,
} from 'lucide-react';
import {
  VoiceSettings,
  ModelSettings,
  PrivacySettings,
  UserProfile,
} from '../../types/assistant';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings: VoiceSettings;
  modelSettings: ModelSettings;
  privacySettings: PrivacySettings;
  profile: UserProfile;
  onSaveVoiceSettings: (s: VoiceSettings) => void;
  onSaveModelSettings: (s: ModelSettings) => void;
  onSavePrivacySettings: (s: PrivacySettings) => void;
  onSaveProfile: (p: UserProfile) => void;
  onExportData: () => void;
  onResetAllData: () => void;
  onOpenApkModal: () => void;
  onBackToDashboard?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voiceSettings,
  modelSettings,
  privacySettings,
  profile,
  onSaveVoiceSettings,
  onSaveModelSettings,
  onSavePrivacySettings,
  onSaveProfile,
  onExportData,
  onResetAllData,
  onOpenApkModal,
  onBackToDashboard,
}) => {
  const [activeSubModal, setActiveSubModal] = useState<string | null>(null);

  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [localVoice, setLocalVoice] = useState<VoiceSettings>(voiceSettings);
  const [localModel, setLocalModel] = useState<ModelSettings>(modelSettings);
  const [localPrivacy, setLocalPrivacy] = useState<PrivacySettings>(privacySettings);

  const handleSave = () => {
    onSaveProfile(localProfile);
    onSaveVoiceSettings(localVoice);
    onSaveModelSettings(localModel);
    onSavePrivacySettings(localPrivacy);
    setActiveSubModal(null);
  };

  const settingsItems = [
    {
      id: 'voice_avatar',
      title: 'Voice & Avatar',
      subtitle: 'Voice, Language, Appearance',
      icon: User,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    },
    {
      id: 'ai_model',
      title: 'AI Model Provider',
      subtitle: 'Gemini, OpenAI, Local LLM',
      icon: Cpu,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    },
    {
      id: 'memory_privacy',
      title: 'Memory & Privacy',
      subtitle: 'Data Control, Encryption',
      icon: Shield,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    },
    {
      id: 'apps_integrations',
      title: 'Apps & Integrations',
      subtitle: 'Email, Calendar, Google Drive',
      icon: Grid,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Reminders, Alerts',
      icon: Bell,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    },
    {
      id: 'security',
      title: 'Security',
      subtitle: 'Permissions, Biometric',
      icon: Lock,
      color: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
    },
    {
      id: 'about',
      title: 'About Vivek AI',
      subtitle: 'Version 1.0.0',
      icon: Info,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030919]/95 text-slate-100 flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn border-2 border-cyan-500/30 overflow-y-auto">
      {/* Top Header matching reference image: "<- Settings  ..." */}
      <header className="px-2 py-3 border-b border-cyan-500/25 bg-[#081730]/80 backdrop-blur-md flex items-center justify-between z-10 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onBackToDashboard) onBackToDashboard();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Settings
          </h2>
        </div>

        <button
          onClick={onOpenApkModal}
          className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5"
          title="Android APK Pipeline"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>APK Pipeline</span>
        </button>
      </header>

      {/* Settings List matching reference image exactly */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2.5 max-w-xl mx-auto w-full">
        {settingsItems.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveSubModal(item.id)}
              className="p-3.5 rounded-2xl bg-[#081730]/80 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.1)] flex items-center justify-between gap-3 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3.5 truncate">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </div>
          );
        })}

        {/* Sub-Modal / Drawer for Detailed Config */}
        {activeSubModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#081730] border-2 border-cyan-400 rounded-3xl p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                <h3 className="font-bold text-sm text-cyan-300 uppercase">
                  {settingsItems.find((s) => s.id === activeSubModal)?.title}
                </h3>
                <button onClick={() => setActiveSubModal(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              {activeSubModal === 'voice_avatar' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Prebuilt Gemini Voice</label>
                    <select
                      value={localVoice.geminiVoice}
                      onChange={(e) => setLocalVoice({ ...localVoice, geminiVoice: e.target.value as any })}
                      className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2 text-white"
                    >
                      <option value="Zephyr">Zephyr (Calm, friendly, balanced)</option>
                      <option value="Puck">Puck (Energetic, upbeat)</option>
                      <option value="Kore">Kore (Clear, articulate, gentle)</option>
                      <option value="Fenrir">Fenrir (Deep, authoritative)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Default Language</label>
                    <select
                      value={localVoice.preferredLanguage}
                      onChange={(e) => setLocalVoice({ ...localVoice, preferredLanguage: e.target.value as any })}
                      className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2 text-white"
                    >
                      <option value="auto">Auto-Detect</option>
                      <option value="hinglish">Hinglish</option>
                      <option value="hindi">Hindi</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSubModal === 'ai_model' && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed">
                    ✓ <strong>100% Free Edition:</strong> Vivek AI uses Google Gemini's standard Free Tier. There are no subscription fees, paid credits, or billing required.
                  </div>
                  <label className="text-slate-400 block mb-1">Model Architecture</label>
                  <select
                    value={localModel.model}
                    onChange={(e) => setLocalModel({ ...localModel, model: e.target.value })}
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2 text-white"
                  >
                    <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (100% Free Tier - Active)</option>
                    <option value="gemini-3.1-flash-lite">Google Gemini 3.1 Flash Lite (Free Tier - Fast)</option>
                  </select>
                </div>
              )}

              {activeSubModal === 'memory_privacy' && (
                <div className="space-y-3">
                  <button
                    onClick={onExportData}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export All Data JSON
                  </button>
                  <button
                    onClick={() => {
                      onResetAllData();
                      setActiveSubModal(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold"
                  >
                    Factory Reset Memory
                  </button>
                </div>
              )}

              {activeSubModal === 'apps_integrations' && (
                <div className="space-y-2 text-slate-300 text-xs">
                  <p>Google Workspace & Android App launcher integration:</p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
                    <div className="flex justify-between"><span>Email (Draft & Send):</span><span className="text-emerald-400">Ready</span></div>
                    <div className="flex justify-between"><span>Calendar Events:</span><span className="text-emerald-400">Ready</span></div>
                    <div className="flex justify-between"><span>Google Drive:</span><span className="text-cyan-300">Enabled</span></div>
                  </div>
                </div>
              )}

              {activeSubModal === 'about' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="font-bold text-white">Vivek AI Assistant v1.0.0</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Inspired by Iron Man's JARVIS HUD. Engineered with multilingual Hindi/Hinglish speech, proactive memory, task automation, and automated GitHub Actions Android APK builds.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
                <button
                  onClick={() => setActiveSubModal(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Banner matching reference image: "[V] Better Conversations, A Smarter You" */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#081730]/90 max-w-xl mx-auto w-full">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-[0_0_8px_#00f0ff]">
              V
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block tracking-wide">
                Better Conversations
              </span>
              <span className="text-[11px] text-cyan-300">
                A Smarter You
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
