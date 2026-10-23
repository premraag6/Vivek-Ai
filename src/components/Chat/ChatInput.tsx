import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, X, Square, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, fileAttachment?: any) => void;
  onOpenVoiceMode: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  onInterruptSpeech: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onOpenVoiceMode,
  isListening,
  isSpeaking,
  onInterruptSpeech,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: number;
    mimeType: string;
    extractedText?: string;
    base64Data?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && !attachedFile) || disabled) return;
    onSendMessage(text.trim(), attachedFile || undefined);
    setText('');
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type || 'text/plain';

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        setAttachedFile({
          name: file.name,
          size: file.size,
          mimeType,
          base64Data,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Read text / document files
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setAttachedFile({
          name: file.name,
          size: file.size,
          mimeType,
          extractedText: content.slice(0, 30000), // First 30k chars
        });
      };
      reader.readAsText(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const quickPrompts = [
    'Bhai, aaj ka plan kya hai?',
    'Feeling a bit stressed today...',
    'Add task: complete Android APK build',
    'Set reminder for 8:00 PM',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-3 pb-3">
      {/* Quick Hinglish Prompt Suggestions */}
      {!text && !attachedFile && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 mb-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(prompt)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Attached file chip */}
      {attachedFile && (
        <div className="mb-2 p-2 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="font-medium truncate">{attachedFile.name}</span>
            <span className="text-[10px] text-slate-400">
              ({(attachedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={() => setAttachedFile(null)}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Input Box */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/80 shadow-lg transition-all p-2 flex items-end gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.docx,.csv,.json,.md,image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* File Attach Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0"
          title="Attach Document or Image (TXT, PDF, CSV, JSON, images)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Vivek in Hindi, Hinglish, or English..."
          disabled={disabled}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none py-2 px-1 max-h-32 leading-relaxed"
        />

        {/* Speech Interrupt Button if Vivek is talking */}
        {isSpeaking && (
          <button
            type="button"
            onClick={onInterruptSpeech}
            className="p-2.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors flex-shrink-0"
            title="Interrupt Vivek speech"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        )}

        {/* Voice Mode / Mic Button */}
        <button
          type="button"
          onClick={onOpenVoiceMode}
          className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
            isListening
              ? 'bg-emerald-500 text-white shadow-emerald-500/30 animate-pulse'
              : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
          }`}
          title="Open Vivek Voice Mode"
        >
          {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!text.trim() && !attachedFile) || disabled}
          className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
            text.trim() || attachedFile
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
              : 'text-slate-600 bg-slate-800/40 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
