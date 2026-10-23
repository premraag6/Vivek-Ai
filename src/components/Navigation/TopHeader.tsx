import React from 'react';
import { VivekAvatar } from '../Avatar/VivekAvatar';
import { AvatarState, AppTab } from '../../types/assistant';
import {
  Mic,
  Settings as SettingsIcon,
  Smartphone,
  Bookmark,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface TopHeaderProps {
  avatarState: AvatarState;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenVoiceMode: () => void;
  onOpenSettings: () => void;
  onOpenApkModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  avatarState,
  activeTab,
  onSelectTab,
  onOpenVoiceMode,
  onOpenSettings,
  onOpenApkModal,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & Mini Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('chat')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="relative">
            <VivekAvatar state={avatarState} size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                Vivek AI
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Assistant
              </span>
            </div>
            <p className="text-[10px] text-slate-400 capitalize">
              {avatarState === 'idle' ? 'Hindi • Hinglish • English' : avatarState}
            </p>
          </div>
        </button>
      </div>

      {/* Desktop Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => onSelectTab('chat')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => onSelectTab('memory')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'memory'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Memory</span>
        </button>

        <button
          onClick={() => onSelectTab('tasks')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Tasks & Routines</span>
        </button>

        <button
          onClick={() => onSelectTab('files')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'files'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Documents</span>
        </button>
      </nav>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        {/* Voice Mode Quick Button */}
        <button
          onClick={onOpenVoiceMode}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all transform active:scale-95"
          title="Open Natural Voice Conversation"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voice Mode</span>
        </button>

        {/* APK Build Guide */}
        <button
          onClick={onOpenApkModal}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
          title="Android APK Pipeline & GitHub Actions Guide"
        >
          <Smartphone className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
