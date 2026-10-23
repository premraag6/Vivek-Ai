import React, { useState } from 'react';
import { TaskItem, ReminderItem, DailyRoutine } from '../../types/assistant';
import {
  ArrowLeft,
  MoreVertical,
  Check,
  Plus,
  Trash2,
  Clock,
  Bell,
  Calendar,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TasksRemindersViewProps {
  tasks: TaskItem[];
  reminders: ReminderItem[];
  routines: DailyRoutine[];
  onAddTask: (title: string, priority: TaskItem['priority'], dueDate?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddReminder: (text: string, time: string) => void;
  onDismissReminder: (id: string) => void;
  onToggleRoutine: (id: string) => void;
  onRunRoutineNow: (routine: DailyRoutine) => void;
  onBackToDashboard?: () => void;
}

export const TasksRemindersView: React.FC<TasksRemindersViewProps> = ({
  tasks,
  reminders,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddReminder,
  onDismissReminder,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'reminders'>('tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskItem['priority']>('medium');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask(taskTitle.trim(), taskPriority, taskDueDate || 'Today 6:00 PM');
    setTaskTitle('');
    setTaskDueDate('');
    setIsAdding(false);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleTask(id);
    if (!currentlyCompleted) {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030919] text-slate-100 border-2 border-cyan-500/30 overflow-hidden relative">
      {/* Top Header: "<- Tasks & Reminders  ..." matching reference image */}
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
            Tasks & Reminders
          </h2>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-xl text-cyan-400 hover:bg-slate-900 transition-colors"
          title="Add New"
        >
          <MoreVertical className="w-5 h-5 text-cyan-400" />
        </button>
      </header>

      {/* Tabs: [Tasks] [Reminders] matching reference image */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-cyan-500/20 bg-[#061325]/50">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            activeTab === 'tasks'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            activeTab === 'reminders'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Reminders
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-w-xl mx-auto w-full">
        {/* Form Modal if adding */}
        {isAdding && (
          <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-[#081730] border border-cyan-400/50 space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase">New Task</h4>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. AI Project Review"
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                placeholder="Due date (e.g. Today 6:00 PM)"
                className="bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 flex-1"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tasks List matching reference image exactly */}
        {activeTab === 'tasks' && (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggle(task.id, task.completed)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-[#081730]/40 border-cyan-500/20 opacity-80'
                    : 'bg-[#081730]/80 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                }`}
              >
                <div className="flex items-center gap-3.5 truncate">
                  {/* Cyan Glowing Checkbox matching reference image */}
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                      task.completed
                        ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.7)]'
                        : 'border-cyan-500/50 bg-slate-950'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="truncate">
                    <span
                      className={`text-xs font-bold block truncate ${
                        task.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-cyan-400/90 font-mono block">
                      {task.dueDate || 'Today 10:00 AM'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reminders List */}
        {activeTab === 'reminders' && (
          <div className="space-y-2.5">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 rounded-2xl bg-[#081730]/80 border border-cyan-500/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {rem.reminderText}
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">
                      {rem.timeStr}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDismissReminder(rem.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs text-slate-300 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Button matching reference image: "+ Add Task" */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#081730]/90">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-1.5 transition-all transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Task</span>
        </button>
      </div>
    </div>
  );
};
