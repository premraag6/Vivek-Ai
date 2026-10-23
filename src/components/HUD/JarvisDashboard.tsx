import React, { useState, useEffect } from 'react';
import {
  AppTab,
  AvatarState,
  TaskItem,
  MemoryItem,
  VoiceSettings,
  UserProfile,
} from '../../types/assistant';
import { JarvisReactor } from './JarvisReactor';
import { HolographicGlobe } from './HolographicGlobe';
import { HolographicAvatar } from './HolographicAvatar';
import {
  Home,
  MessageSquare,
  Mic,
  Bookmark,
  FileText,
  CheckCircle2,
  Calendar,
  Grid,
  Settings as SettingsIcon,
  ChevronRight,
  Wifi,
  Battery,
  HardDrive,
  CloudSun,
  Search,
  FileEdit,
  Bell,
  Sparkles,
  User,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface JarvisDashboardProps {
  avatarState: AvatarState;
  isListening: boolean;
  isSpeaking: boolean;
  amplitude: number;
  tasks: TaskItem[];
  memories: MemoryItem[];
  voiceSettings: VoiceSettings;
  profile: UserProfile;
  onSelectTab: (tab: AppTab) => void;
  onToggleMic: () => void;
  onInterruptSpeech: () => void;
  onToggleTask: (id: string) => void;
  onQuickAction: (action: string) => void;
  onOpenVoiceMode: () => void;
}

export const JarvisDashboard: React.FC<JarvisDashboardProps> = ({
  avatarState,
  isListening,
  isSpeaking,
  amplitude,
  tasks,
  memories,
  voiceSettings,
  profile,
  onSelectTab,
  onToggleMic,
  onInterruptSpeech,
  onToggleTask,
  onQuickAction,
  onOpenVoiceMode,
}) => {
  const [timeStr, setTimeStr] = useState('10:24 AM');
  const [dateStr, setDateStr] = useState('23 Oct 2026 | Fri');
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Real-time clock & real battery query if available
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setDateStr(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} | ${days[now.getDay()]}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Battery API check
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }).catch(() => {});
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto overflow-x-hidden p-2 sm:p-4 select-none relative">
      {/* Sci-fi Outer HUD Metallic Bezel & Corner Cutouts (Matching Reference Image) */}
      <div className="w-full flex-1 rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-b from-[#06152d]/90 via-[#030919]/95 to-[#050f24]/90 shadow-[0_0_35px_rgba(0,240,255,0.25)] flex flex-col relative overflow-hidden backdrop-blur-xl">
        {/* Top Chamfer Sci-fi Accent Lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

        {/* TOP STATUS HEADER */}
        <header className="px-4 sm:px-6 py-3 border-b border-cyan-500/25 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 relative z-10">
          {/* Left Brand Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.7)] flex-shrink-0">
              <span className="font-black text-white text-base tracking-tighter">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-widest text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  VIVEK AI
                </h1>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Free • Gemini AI
                </span>
              </div>
              <p className="text-[10px] text-cyan-300/80 tracking-wider">
                Your Intelligent Companion
              </p>
            </div>
          </div>

          {/* Clock, Date, Weather */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div>
              <span className="text-xs font-bold text-cyan-100 block">{timeStr}</span>
              <span className="text-[10px] text-slate-400">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-cyan-500/30 text-xs">
              <CloudSun className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-semibold text-slate-200 block text-xs">26°C</span>
                <span className="text-[10px] text-slate-400">New Delhi</span>
              </div>
            </div>
          </div>

          {/* Center Glowing Hindi Greeting */}
          <div className="hidden md:flex flex-col items-center justify-center text-center">
            <h2 className="text-base sm:text-lg font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.7)] tracking-wide">
              नमस्ते! मैं Vivek हूँ
            </h2>
            <p className="text-xs text-cyan-200/80 font-medium">
              बोलो... मैं सुन रहा हूँ
            </p>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-3 text-xs">
            {/* Voice Toggle */}
            <button
              onClick={onToggleMic}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                voiceSettings.autoSpeak
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice {voiceSettings.autoSpeak ? 'ON' : 'OFF'}</span>
            </button>

            {/* Profile icon */}
            <button
              onClick={() => onSelectTab('settings')}
              className="p-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-slate-300 hover:text-white"
              title="User Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* WiFi */}
            <div className="flex items-center gap-1 text-cyan-400" title="Network Connected">
              <Wifi className="w-4 h-4" />
            </div>

            {/* Battery */}
            <div className="flex items-center gap-1 text-slate-200 font-medium text-xs">
              <Battery className="w-4 h-4 text-emerald-400" />
              <span>{batteryLevel}%</span>
            </div>
          </div>
        </header>

        {/* MAIN HUD INTERFACE GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 sm:p-5 relative overflow-y-auto">
          {/* =========================================
              LEFT SIDEBAR: HUD Navigation Menu
             ========================================= */}
          <div className="md:col-span-2 flex flex-col justify-between gap-3">
            <div className="space-y-1">
              {[
                { id: 'chat' as AppTab, label: 'Home', icon: Home, isHome: true },
                { id: 'chat' as AppTab, label: 'Chat', icon: MessageSquare },
                { id: 'voice' as AppTab, label: 'Voice', icon: Mic },
                { id: 'memory' as AppTab, label: 'Memory', icon: Bookmark },
                { id: 'files' as AppTab, label: 'Files', icon: FileText },
                { id: 'tasks' as AppTab, label: 'Tasks', icon: CheckCircle2 },
                { id: 'tasks' as AppTab, label: 'Calendar', icon: Calendar },
                { id: 'tasks' as AppTab, label: 'Apps', icon: Grid },
                { id: 'settings' as AppTab, label: 'Settings', icon: SettingsIcon },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = idx === 0; // Home is default highlight on HUD

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.label === 'Voice') {
                        onOpenVoiceMode();
                      } else {
                        onSelectTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.5)] border border-cyan-300'
                        : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-cyan-300" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Left Profile Card */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center gap-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-400 p-0.5 flex-shrink-0">
                <HolographicAvatar state={avatarState} className="w-full h-full transform scale-75" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Vivek</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-cyan-300/70 block truncate">
                  Always here for you...
                </span>
              </div>
            </div>
          </div>

          {/* =========================================
              MIDDLE LEFT: Today's Tasks & Quick Actions
             ========================================= */}
          <div className="md:col-span-3 flex flex-col gap-3">
            {/* Today's Tasks Panel */}
            <div className="p-3.5 rounded-2xl bg-[#081730]/75 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)] space-y-2.5">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Today's Tasks</span>
                </div>
                <button
                  onClick={() => onSelectTab('tasks')}
                  className="text-slate-400 hover:text-cyan-300 text-xs"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-all text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-cyan-500 border-cyan-300 text-slate-950'
                            : 'border-cyan-500/50'
                        }`}
                      >
                        {task.completed && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                      <span className={`truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono ml-2 flex-shrink-0">
                      {task.dueDate || '10:00 AM'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="p-3.5 rounded-2xl bg-[#081730]/75 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Quick Actions</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onQuickAction('open_apps')}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-400 text-center flex flex-col items-center gap-1 transition-all group"
                >
                  <Grid className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium text-slate-300 group-hover:text-cyan-200">
                    Open Apps
                  </span>
                </button>

                <button
                  onClick={() => onQuickAction('search_web')}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-400 text-center flex flex-col items-center gap-1 transition-all group"
                >
                  <Search className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium text-slate-300 group-hover:text-cyan-200">
                    Search Web
                  </span>
                </button>

                <button
                  onClick={() => onQuickAction('create_note')}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-400 text-center flex flex-col items-center gap-1 transition-all group"
                >
                  <FileEdit className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium text-slate-300 group-hover:text-cyan-200">
                    Create Note
                  </span>
                </button>

                <button
                  onClick={() => onQuickAction('set_reminder')}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-400 text-center flex flex-col items-center gap-1 transition-all group"
                >
                  <Bell className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium text-slate-300 group-hover:text-cyan-200">
                    Set Reminder
                  </span>
                </button>
              </div>
            </div>

            {/* Holographic Wireframe Globe & System Online Widget */}
            <div className="p-3 rounded-2xl bg-[#081730]/75 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(6,182,212,0.12)]">
              <HolographicGlobe size={68} />
              <div className="text-[10px] space-y-1">
                <span className="font-extrabold text-cyan-300 tracking-wider block uppercase border-b border-cyan-500/20 pb-0.5">
                  SYSTEM ONLINE
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">AI CORE:</span>
                  <span className="font-bold text-emerald-400">GEMINI FREE</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">MEMORY:</span>
                  <span className="font-bold text-cyan-300">SYNCED</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">TIER:</span>
                  <span className="font-bold text-emerald-400">100% FREE</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              CENTER: The Jarvis Arc Reactor Core
             ========================================= */}
          <div className="md:col-span-4 flex flex-col items-center justify-center my-auto py-4">
            <JarvisReactor
              state={avatarState}
              isListening={isListening}
              isSpeaking={isSpeaking}
              amplitude={amplitude}
              onToggleMic={onToggleMic}
              onInterrupt={onInterruptSpeech}
            />
          </div>

          {/* =========================================
              MIDDLE RIGHT: Memory, Files, System Status
             ========================================= */}
          <div className="md:col-span-3 flex flex-col gap-3">
            {/* Top Right Avatar Box */}
            <div className="p-3.5 rounded-2xl bg-[#081730]/75 border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.12)]">
              <HolographicAvatar state={avatarState} onClick={() => onSelectTab('chat')} />
            </div>

            {/* Memory & Preferences Widget */}
            <div className="p-3.5 rounded-2xl bg-[#081730]/75 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)] space-y-2">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  <Bookmark className="w-4 h-4 text-cyan-400" />
                  <span>Memory</span>
                </div>
                <button onClick={() => onSelectTab('memory')} className="text-slate-400 hover:text-cyan-300">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { label: 'Your Goals', icon: '💎', cat: 'goal' },
                  { label: 'Interests', icon: '👤', cat: 'preference' },
                  { label: 'Important People', icon: '👥', cat: 'personal' },
                  { label: 'Shared Moments', icon: '📸', cat: 'personal' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectTab('memory')}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors text-slate-300 hover:text-cyan-200"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Files Widget */}
            <div className="p-3.5 rounded-2xl bg-[#081730]/75 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)] space-y-2">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Recent Files</span>
                </div>
                <button onClick={() => onSelectTab('files')} className="text-slate-400 hover:text-cyan-300">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { name: 'Project_Report.pdf', time: '2 hours ago' },
                  { name: 'Notes.txt', time: '5 hours ago' },
                  { name: 'Budget.xlsx', time: 'Yesterday' },
                ].map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectTab('files')}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors text-slate-300 text-left truncate"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <div className="truncate">
                        <span className="block truncate text-slate-200">{file.name}</span>
                        <span className="text-[9px] text-slate-500">{file.time}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* System Status Panel */}
            <div className="p-3.5 rounded-2xl bg-[#081730]/75 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)] space-y-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block border-b border-cyan-500/20 pb-1.5">
                System Status
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Wifi className="w-3 h-3 text-cyan-400" /> Internet
                    </span>
                    <span className="text-emerald-400 font-semibold">Connected</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-cyan-400 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Battery className="w-3 h-3 text-emerald-400" /> Battery
                    </span>
                    <span className="text-slate-200 font-semibold">{batteryLevel}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${batteryLevel}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <HardDrive className="w-3 h-3 text-cyan-400" /> Storage
                    </span>
                    <span className="text-slate-200 font-semibold">64% used</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="w-[64%] h-full bg-cyan-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
