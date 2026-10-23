import React, { useState } from 'react';
import { ChatMessage, ToolCallExecution } from '../../types/assistant';
import { VivekAvatar } from '../Avatar/VivekAvatar';
import {
  Volume2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  Bookmark,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSpeakText: (text: string) => void;
  onToolActionConfirm?: (tool: ToolCallExecution, confirm: boolean) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSpeakText,
  onToolActionConfirm,
}) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 py-2 px-1 max-w-3xl mx-auto w-full group ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 pt-0.5">
          <VivekAvatar
            state={message.avatarState || 'idle'}
            size="sm"
          />
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[78%] ${
          isAssistant ? 'items-start' : 'items-end'
        }`}
      >
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-[11px] font-semibold text-slate-400">
            {isAssistant ? 'Vivek AI' : 'You'}
          </span>
          <span className="text-[10px] text-slate-500">{message.timestamp}</span>
        </div>

        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
            isAssistant
              ? 'bg-slate-900 border border-slate-800/90 text-slate-100 rounded-tl-sm'
              : 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-600/20'
          }`}
        >
          {/* File attachment tag if attached */}
          {message.fileAttachment && (
            <div className="mb-2 p-2 rounded-lg bg-black/20 border border-white/10 flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-white/20 font-mono text-[10px] uppercase">
                File
              </span>
              <span className="font-medium truncate">{message.fileAttachment.name}</span>
            </div>
          )}

          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {/* Interactive Tool Badges (Automated Agent Actions) */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              {message.toolCalls.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-indigo-300">
                      {tool.name === 'create_task' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {tool.name === 'create_reminder' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      {tool.name === 'prepare_email_draft' && <Mail className="w-3.5 h-3.5 text-sky-400" />}
                      {tool.name === 'save_personal_memory' && <Bookmark className="w-3.5 h-3.5 text-purple-400" />}
                      {tool.name === 'open_screen' && <ExternalLink className="w-3.5 h-3.5 text-teal-400" />}
                      <span className="capitalize">{tool.name.replace(/_/g, ' ')}</span>
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        tool.status === 'executed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : tool.status === 'confirmed'
                          ? 'bg-blue-950 text-blue-400'
                          : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      {tool.status}
                    </span>
                  </div>

                  {/* Tool Arguments Summary */}
                  <div className="text-[11px] text-slate-300 pl-5">
                    {tool.name === 'create_task' && (
                      <p>Task: "{tool.args.title}" (Priority: {tool.args.priority || 'medium'})</p>
                    )}
                    {tool.name === 'create_reminder' && (
                      <p>Reminder: "{tool.args.reminderText}" at {tool.args.time}</p>
                    )}
                    {tool.name === 'prepare_email_draft' && (
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-200">Subject: {tool.args.subject}</p>
                        <p className="italic text-slate-400">To: {tool.args.recipient || 'Draft'}</p>
                        <p className="bg-slate-900/90 p-2 rounded text-slate-300">{tool.args.body}</p>
                        {tool.status === 'pending' && (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => onToolActionConfirm?.(tool, true)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium"
                            >
                              Approve Email Draft
                            </button>
                            <button
                              onClick={() => onToolActionConfirm?.(tool, false)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {tool.name === 'save_personal_memory' && (
                      <p>Stored: "{tool.args.fact}"</p>
                    )}
                    {tool.name === 'open_screen' && (
                      <p>Screen: {tool.args.screen}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Actions */}
        <div
          className={`flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            isAssistant ? 'justify-start' : 'justify-end'
          }`}
        >
          {isAssistant && (
            <button
              onClick={() => onSpeakText(message.content)}
              className="p-1 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              title="Speak message"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy message"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
