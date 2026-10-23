import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
  Send,
  UploadCloud,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface DocumentChatViewProps {
  onAnalyzeDocument: (docName: string, docText: string, instruction: string) => void;
  onBackToDashboard?: () => void;
}

export const DocumentChatView: React.FC<DocumentChatViewProps> = ({
  onAnalyzeDocument,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'ask'>('files');
  const [docPrompt, setDocPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<string>('Project_Report.pdf');

  // Seeded files matching reference image exactly
  const [fileList, setFileList] = useState([
    {
      id: 'f-1',
      name: 'Project_Report.pdf',
      size: '2.4 MB',
      type: 'PDF',
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      icon: FileText,
      content: 'Project Report for Vivek AI Assistant: Architecture covers reactive holographic HUD, server-side Gemini 3.8 Flash SDK proxy, and automated GitHub Actions APK builds.',
    },
    {
      id: 'f-2',
      name: 'Notes.txt',
      size: '120 KB',
      type: 'TXT',
      color: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      icon: FileText,
      content: 'Personal notes: Remember to drink water regularly, keep workout routine at 6 PM, and complete AI project review.',
    },
    {
      id: 'f-3',
      name: 'Budget.xlsx',
      size: '856 KB',
      type: 'XLSX',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      icon: FileSpreadsheet,
      content: 'Monthly budget breakdown: Server infrastructure, development tools, mobile testing devices.',
    },
    {
      id: 'f-4',
      name: 'Image.jpg',
      size: '1.2 MB',
      type: 'JPG',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      icon: ImageIcon,
      content: '[Image analysis metadata: High-resolution holographic UI reference wireframe with glowing cyan arc reactor].',
    },
    {
      id: 'f-5',
      name: 'Document.docx',
      size: '1.1 MB',
      type: 'DOCX',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      icon: FileText,
      content: 'User specifications document: Hindi/Hinglish speech recognition, local encryption, task reminders.',
    },
    {
      id: 'f-6',
      name: 'Data.json',
      size: '48 KB',
      type: 'JSON',
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      icon: FileCode,
      content: '{\n  "version": "1.0.0",\n  "app": "Vivek AI",\n  "status": "online"\n}',
    },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const newDoc = {
        id: 'f-' + Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'TXT',
        color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        icon: FileText,
        content: text.slice(0, 30000),
      };
      setFileList([newDoc, ...fileList]);
      setSelectedFile(file.name);
    };
    reader.readAsText(file);
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docPrompt.trim()) return;

    const doc = fileList.find((f) => f.name === selectedFile) || fileList[0];
    onAnalyzeDocument(doc.name, doc.content, docPrompt.trim());
    setDocPrompt('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030919] text-slate-100 border-2 border-cyan-500/30 overflow-hidden relative">
      {/* Top Header: "<- Files & Documents  ..." matching reference image */}
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
            Files & Documents
          </h2>
        </div>

        <label className="p-1.5 rounded-xl text-cyan-400 hover:bg-slate-900 transition-colors cursor-pointer" title="Upload new file">
          <input type="file" onChange={handleFileUpload} className="hidden" />
          <UploadCloud className="w-5 h-5" />
        </label>
      </header>

      {/* Tabs: [Files] [Ask from File] matching reference image */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-cyan-500/20 bg-[#061325]/50">
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            activeTab === 'files'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab('ask')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            activeTab === 'ask'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Ask from File
        </button>
      </div>

      {/* File List matching reference image layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-w-xl mx-auto w-full">
        {fileList.map((file) => {
          const IconComp = file.icon;
          const isSelected = selectedFile === file.name;

          return (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file.name)}
              className={`p-3 rounded-2xl bg-[#081730]/80 border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'border-cyan-500/30 hover:border-cyan-400/50'
              }`}
            >
              <div className="flex items-center gap-3.5 truncate">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${file.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {file.size} • {file.type}
                  </span>
                </div>
              </div>

              {isSelected && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40">
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar: "Ask about your files" matching reference image */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#081730]/90">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-1.5">
          Ask about: {selectedFile}
        </span>
        <form onSubmit={handleSendPrompt} className="relative flex items-center">
          <input
            type="text"
            value={docPrompt}
            onChange={(e) => setDocPrompt(e.target.value)}
            placeholder="e.g. Summarize this report"
            className="w-full bg-slate-950/90 border border-cyan-500/40 rounded-2xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          />
          <button
            type="submit"
            disabled={!docPrompt.trim()}
            className="absolute right-2 p-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
