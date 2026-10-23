import React from 'react';
import { ArrowLeft, MoreVertical, Paperclip, Send, Mic, Image, FileText, Smile } from 'lucide-react';
import { ChatMessage, ToolCallExecution } from '../../types/assistant';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';

interface ChatViewProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onSendMessage: (text: string, fileAttachment?: any) => void;
  onOpenVoiceMode: () => void;
  onInterruptSpeech: () => void;
  onSpeakText: (text: string) => void;
  onBackToDashboard: () => void;
  onToolConfirm?: (tool: ToolCallExecution, confirm: boolean) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isProcessing,
  isListening,
  isSpeaking,
  onSendMessage,
  onOpenVoiceMode,
  onInterruptSpeech,
  onSpeakText,
  onBackToDashboard,
  onToolConfirm,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#030919] text-slate-100 border-2 border-cyan-500/30 overflow-hidden relative">
      {/* Top Header matching reference image: "<- [V] Vivek AI Online ..." */}
      <header className="px-4 py-3 border-b border-cyan-500/25 bg-[#081730]/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            title="Back to HUD Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>

          {/* V Emblem Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 border border-cyan-300 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.6)]">
            <span className="font-black text-white text-xs">V</span>
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Vivek AI
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-cyan-300 font-medium">Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenVoiceMode}
          className="p-2 rounded-xl text-cyan-400 hover:bg-slate-900 transition-colors"
          title="Open Voice Conversation"
        >
          <MoreVertical className="w-5 h-5 text-cyan-400" />
        </button>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onSpeakText={onSpeakText}
            onToolActionConfirm={onToolConfirm}
          />
        ))}

        {isProcessing && (
          <div className="flex items-center gap-3 py-2 px-1 max-w-3xl mx-auto w-full">
            <div className="w-7 h-7 rounded-full bg-cyan-600 border border-cyan-300 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_8px_#00f0ff]">
              V
            </div>
            <div className="p-3 rounded-2xl bg-[#081730] border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Vivek is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input Area matching reference styling */}
      <ChatInput
        onSendMessage={onSendMessage}
        onOpenVoiceMode={onOpenVoiceMode}
        isListening={isListening}
        isSpeaking={isSpeaking}
        onInterruptSpeech={onInterruptSpeech}
        disabled={isProcessing}
      />
    </div>
  );
};
