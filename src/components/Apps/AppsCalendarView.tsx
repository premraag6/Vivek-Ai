import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Mail,
  Grid,
  ExternalLink,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AppsCalendarViewProps {
  onBackToDashboard: () => void;
  onDraftEmail: (to: string, subject: string, body: string) => void;
  onScheduleEvent: (title: string, time: string) => void;
}

export const AppsCalendarView: React.FC<AppsCalendarViewProps> = ({
  onBackToDashboard,
  onDraftEmail,
  onScheduleEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'email' | 'apps'>('calendar');

  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [events, setEvents] = useState([
    { id: '1', title: 'AI Project Architecture Review', time: 'Today 10:00 AM', status: 'confirmed' },
    { id: '2', title: 'Team Sync & Product Strategy', time: 'Today 12:30 PM', status: 'confirmed' },
    { id: '3', title: 'Android APK Testing Session', time: 'Tomorrow 3:00 PM', status: 'pending' },
  ]);

  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailDrafted, setEmailDrafted] = useState(false);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle.trim(),
      time: eventTime || 'Scheduled Time',
      status: 'confirmed',
    };
    setEvents([...events, newEvent]);
    onScheduleEvent(newEvent.title, newEvent.time);
    setEventTitle('');
    setEventTime('');
  };

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim()) return;
    onDraftEmail(emailTo, emailSubject, emailBody);
    setEmailDrafted(true);
    setTimeout(() => setEmailDrafted(false), 3000);
  };

  const supportedApps = [
    { name: 'Google Calendar', desc: 'Sync events, schedules, meetings', icon: CalendarIcon, color: 'text-blue-400 bg-blue-500/20' },
    { name: 'Gmail', desc: 'Draft, summarize, and prepare replies', icon: Mail, color: 'text-rose-400 bg-rose-500/20' },
    { name: 'Google Drive', desc: 'Read and summarize cloud files', icon: Grid, color: 'text-amber-400 bg-amber-500/20' },
    { name: 'Android System Apps', desc: 'Phone dialer, Clock alarms, Settings', icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/20' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030919] text-slate-100 border-2 border-cyan-500/30 overflow-hidden relative">
      {/* Header */}
      <header className="px-4 py-3 border-b border-cyan-500/25 bg-[#081730]/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Calendar & App Integrations
          </h2>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-cyan-500/20 bg-[#061325]/50">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            activeTab === 'calendar'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            activeTab === 'email'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Email Drafts
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            activeTab === 'apps'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Connected Apps
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-xl mx-auto w-full">
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* Quick add event */}
            <form onSubmit={handleCreateEvent} className="p-4 rounded-2xl bg-[#081730] border border-cyan-500/30 space-y-3">
              <span className="text-xs font-bold text-cyan-300 uppercase block">Schedule Event</span>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Meeting or event title"
                className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="Date & Time (e.g. Today 4:00 PM)"
                  className="flex-1 bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Schedule
                </button>
              </div>
            </form>

            {/* Event list */}
            <div className="space-y-2">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-[#081730]/80 border border-cyan-500/30 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{ev.title}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{ev.time}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleDraftSubmit} className="p-4 rounded-2xl bg-[#081730] border border-cyan-500/30 space-y-3">
            <span className="text-xs font-bold text-cyan-300 uppercase block">Prepare Email Draft</span>
            <input
              type="text"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="Recipient (e.g. team@example.com)"
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white placeholder-slate-500"
            />
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Subject"
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white placeholder-slate-500"
            />
            <textarea
              rows={4}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Email content..."
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white placeholder-slate-500"
            />
            {emailDrafted && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Draft prepared and sent to Vivek chat for confirmation!
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white shadow-md"
            >
              Prepare Draft
            </button>
          </form>
        )}

        {activeTab === 'apps' && (
          <div className="space-y-2.5">
            {supportedApps.map((app, i) => {
              const AppIcon = app.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-[#081730]/80 border border-cyan-500/30 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${app.color}`}>
                      <AppIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{app.name}</span>
                      <span className="text-[10px] text-slate-400">{app.desc}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                    Ready
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
