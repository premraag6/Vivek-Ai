import React from 'react';
import { AppTab } from '../../types/assistant';
import {
  MessageSquare,
  Mic,
  Bookmark,
  CheckCircle2,
  FileText,
  Smartphone,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenVoiceMode: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenVoiceMode,
}) => {
  return (
    <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around sticky bottom-0 z-40 select-none">
      <button
        onClick={() => onSelectTab('chat')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          activeTab === 'chat' ? 'text-indigo-400' : 'text-slate-400'
        }`}
      >
        <MessageSquare className="w-4 h-4 mb-0.5" />
        <span>Chat</span>
      </button>

      <button
        onClick={() => onSelectTab('memory')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          activeTab === 'memory' ? 'text-indigo-400' : 'text-slate-400'
        }`}
      >
        <Bookmark className="w-4 h-4 mb-0.5" />
        <span>Memory</span>
      </button>

      {/* Center Voice Mode Button */}
      <button
        onClick={onOpenVoiceMode}
        className="flex flex-col items-center justify-center -mt-5 p-3 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/40 ring-4 ring-slate-950 transform active:scale-95 transition-transform"
      >
        <Mic className="w-5 h-5" />
      </button>

      <button
        onClick={() => onSelectTab('tasks')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          activeTab === 'tasks' ? 'text-indigo-400' : 'text-slate-400'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 mb-0.5" />
        <span>Tasks</span>
      </button>

      <button
        onClick={() => onSelectTab('files')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
          activeTab === 'files' ? 'text-indigo-400' : 'text-slate-400'
        }`}
      >
        <FileText className="w-4 h-4 mb-0.5" />
        <span>Files</span>
      </button>
    </div>
  );
};
