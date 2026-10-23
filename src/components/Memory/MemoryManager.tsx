import React, { useState } from 'react';
import { MemoryItem, PrivacySettings } from '../../types/assistant';
import {
  ArrowLeft,
  Target,
  Heart,
  Users,
  Camera,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Check,
  ToggleLeft,
  ToggleRight,
  Download,
} from 'lucide-react';

interface MemoryManagerProps {
  memories: MemoryItem[];
  privacySettings: PrivacySettings;
  onAddMemory: (fact: string, category: MemoryItem['category']) => void;
  onDeleteMemory: (id: string) => void;
  onClearAllMemories: () => void;
  onToggleMemoryEnabled: (enabled: boolean) => void;
  onClearChatHistory: () => void;
  onExportData: () => void;
  onBackToDashboard?: () => void;
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({
  memories,
  privacySettings,
  onAddMemory,
  onDeleteMemory,
  onClearAllMemories,
  onToggleMemoryEnabled,
  onClearChatHistory,
  onExportData,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'settings'>('saved');
  const [isAdding, setIsAdding] = useState(false);
  const [newFact, setNewFact] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('goal');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;
    onAddMemory(newFact.trim(), newCategory);
    setNewFact('');
    setIsAdding(false);
  };

  // Icon mapping matching reference image
  const getCardIcon = (cat: string, fact: string) => {
    if (cat === 'goal' || fact.toLowerCase().includes('goal')) {
      return {
        icon: Target,
        bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        title: 'My Goals',
      };
    }
    if (cat === 'preference' && (fact.toLowerCase().includes('interest') || fact.toLowerCase().includes('tech') || fact.toLowerCase().includes('music'))) {
      return {
        icon: Heart,
        bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        title: 'Interests',
      };
    }
    if (cat === 'personal' && (fact.toLowerCase().includes('people') || fact.toLowerCase().includes('friend') || fact.toLowerCase().includes('family'))) {
      return {
        icon: Users,
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        title: 'Important People',
      };
    }
    if (fact.toLowerCase().includes('shared') || fact.toLowerCase().includes('moment') || fact.toLowerCase().includes('travel')) {
      return {
        icon: Camera,
        bg: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
        title: 'Shared Moments',
      };
    }
    return {
      icon: SettingsIcon,
      bg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      title: 'Preferences',
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030919] text-slate-100 border-2 border-cyan-500/30 overflow-hidden relative">
      {/* Top Header: "<- Memory" matching reference image */}
      <header className="px-4 py-3 border-b border-cyan-500/25 bg-[#081730]/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-400" />
            </button>
          )}
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Memory
          </h2>
        </div>

        <button
          onClick={onExportData}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Backup JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </header>

      {/* Tabs: [Saved] [History] [Settings] matching reference image */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-cyan-500/20 bg-[#061325]/50">
        {(['saved', 'history', 'settings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              activeTab === t
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-xl mx-auto w-full">
        {activeTab === 'saved' && (
          <>
            {/* Add Memory Modal Form if active */}
            {isAdding && (
              <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-[#081730] border border-cyan-400/50 space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">Save New Memory</h4>
                <textarea
                  rows={2}
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  placeholder="e.g. Preparing for Android certification, likes morning coffee with Hindi news"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="bg-slate-950 border border-cyan-500/30 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                  >
                    <option value="goal">Goal</option>
                    <option value="preference">Preference</option>
                    <option value="personal">Personal / People</option>
                    <option value="project">Project</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Memory Cards matching reference image layout */}
            <div className="space-y-2.5">
              {memories.map((m) => {
                const conf = getCardIcon(m.category, m.fact);
                const IconComp = conf.icon;

                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-[#081730]/80 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.1)] flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3.5 truncate">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${conf.bg}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block">
                          {conf.title}
                        </span>
                        <span className="text-xs text-slate-300 block truncate">
                          {m.fact}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteMemory(m.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors flex-shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#081730]/70 border border-cyan-500/30 text-xs text-slate-300">
              <span className="text-cyan-300 font-bold block mb-1">Conversation Retained Summaries</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Vivek retains key takeaways from previous discussions to maintain context across restarts without storing raw chats indefinitely.
              </p>
            </div>
            <button
              onClick={onClearChatHistory}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-rose-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Clear Conversation History (Keeps Memories)
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#081730]/70 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Persistent Memory</span>
                <span className="text-[11px] text-slate-400">Remember facts between sessions</span>
              </div>
              <button
                onClick={() => onToggleMemoryEnabled(!privacySettings.memoryEnabled)}
                className="text-cyan-400"
              >
                {privacySettings.memoryEnabled ? (
                  <ToggleRight className="w-8 h-8 fill-cyan-500 text-cyan-300" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>

            <button
              onClick={onClearAllMemories}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
            >
              Delete All Saved Memories
            </button>
          </div>
        )}
      </div>

      {/* Bottom Button matching reference image: "+ Add New Memory" */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#081730]/90">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-1.5 transition-all transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Memory</span>
        </button>
      </div>
    </div>
  );
};
