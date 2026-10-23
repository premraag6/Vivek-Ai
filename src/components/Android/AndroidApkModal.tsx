import React, { useState } from 'react';
import {
  X,
  Smartphone,
  GitBranch,
  Terminal,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  Layers,
} from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const [copiedPhase, setCopiedPhase] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhase(id);
    setTimeout(() => setCopiedPhase(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Android APK Pipeline & GitHub Actions</h2>
              <p className="text-xs text-slate-400">
                Package Vivek AI into an installable Android APK (`com.vivekai.assistant`)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Architecture Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                Package ID
              </span>
              <span className="font-mono text-emerald-400 font-medium">com.vivekai.assistant</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                Target Platform
              </span>
              <span className="text-slate-200 font-medium">Android 14 (API 34, minSdk 24)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                CI/CD Pipeline
              </span>
              <span className="text-indigo-400 font-medium">GitHub Actions (.github/workflows)</span>
            </div>
          </div>

          {/* Phase A: AI Studio Setup */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                  A
                </span>
                Phase A — AI Studio Environment
              </span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready in Workspace
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Full-stack backend is configured with Express, server-side Gemini 3.8 Flash, and Gemini neural TTS. Secrets are injected securely via the AI Studio Secrets panel.
            </p>
          </div>

          {/* Phase B: Export to GitHub & Run Automated APK Build */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                  B
                </span>
                Phase B — Automatic GitHub Actions APK Build
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `git init\ngit add .\ngit commit -m "feat: Vivek AI assistant with APK workflow"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/vivek-ai.git\ngit push -u origin main`,
                    'phase-b'
                  )
                }
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {copiedPhase === 'phase-b' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Git Commands</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>
                Push this codebase to your GitHub repository (preserving <code className="text-indigo-300">.github/workflows/android.yml</code> and the <code className="text-indigo-300">android/</code> directory).
              </li>
              <li>
                In GitHub, click the <strong>Actions</strong> tab.
              </li>
              <li>
                Select <strong>Build Vivek AI Android APK</strong> on the left sidebar.
              </li>
              <li>
                Click <strong>Run workflow</strong> → <strong>Branch: main</strong> → <strong>Run workflow</strong>.
              </li>
              <li>
                When finished (~2 minutes), scroll down to the <strong>Artifacts</strong> section and download <code className="text-emerald-400 font-mono">Vivek-AI-debug-APK.zip</code>!
              </li>
            </ol>
          </div>

          {/* Phase C: Install & Run on Device */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                C
              </span>
              Phase C — Android Device Installation
            </span>
            <p className="text-slate-400 leading-relaxed">
              1. Transfer the downloaded <code className="text-slate-200">app-debug.apk</code> to your Android phone (or download directly in Chrome).<br />
              2. Open the file and allow <em>Install unknown apps</em> if prompted.<br />
              3. Launch Vivek AI! The app requests Microphone (<code className="text-slate-200">RECORD_AUDIO</code>) and Notification permissions for voice and reminders.
            </p>
          </div>

          {/* Phase D: Production Release Signing */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                D
              </span>
              Phase D — Release Signing (Google Play / Production)
            </span>
            <p className="text-slate-400 leading-relaxed">
              For distributing a signed release APK or Google Play AAB bundle, add your keystore to GitHub Secrets (<code className="text-slate-200">SIGNING_KEY</code>, <code className="text-slate-200">KEY_ALIAS</code>, <code className="text-slate-200">KEY_PASSWORD</code>, <code className="text-slate-200">STORE_PASSWORD</code>). Never commit release keys to git.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
