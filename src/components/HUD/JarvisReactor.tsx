import React from 'react';
import { Mic, MicOff, Square, Sparkles } from 'lucide-react';
import { AvatarState } from '../../types/assistant';

interface JarvisReactorProps {
  state: AvatarState;
  isListening: boolean;
  isSpeaking: boolean;
  amplitude?: number; // 0 to 1
  onToggleMic: () => void;
  onInterrupt?: () => void;
  className?: string;
}

export const JarvisReactor: React.FC<JarvisReactorProps> = ({
  state,
  isListening,
  isSpeaking,
  amplitude = 0,
  onToggleMic,
  onInterrupt,
  className = '',
}) => {
  // State text and colors matching reference image
  const getStateText = () => {
    if (isSpeaking) return 'Speaking...';
    if (isListening) return 'Listening...';
    if (state === 'thinking') return 'Thinking...';
    if (state === 'happy') return 'Ready • Online';
    if (state === 'empathetic') return 'Listening closely...';
    if (state === 'error') return 'Reconnecting...';
    return 'Ready • Online';
  };

  const getCoreGlow = () => {
    if (isSpeaking) return 'rgba(56, 189, 248, 0.7)';
    if (isListening) return 'rgba(6, 182, 212, 0.9)';
    if (state === 'thinking') return 'rgba(168, 85, 247, 0.8)';
    if (state === 'error') return 'rgba(239, 68, 68, 0.7)';
    return 'rgba(6, 182, 212, 0.55)';
  };

  const glowColor = getCoreGlow();

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer ambient reactor glow */}
      <div
        className="absolute w-72 h-72 sm:w-84 sm:h-84 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(3, 105, 161, 0.25) 50%, transparent 75%)`,
          transform: `scale(${1 + amplitude * 0.2})`,
        }}
      />

      {/* Main Reactor HUD Rings Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Layer 1: Outermost Calibrated Degree Ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none"
          viewBox="0 0 300 300"
        >
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          {/* Calibrated Tick Marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 150 + Math.cos(angle) * 136;
            const y1 = 150 + Math.sin(angle) * 136;
            const x2 = 150 + Math.cos(angle) * (i % 3 === 0 ? 144 : 140);
            const y2 = 150 + Math.sin(angle) * (i % 3 === 0 ? 144 : 140);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 3 === 0 ? '#00f0ff' : 'rgba(6, 182, 212, 0.4)'}
                strokeWidth={i % 3 === 0 ? '2' : '1'}
              />
            );
          })}
        </svg>

        {/* Layer 2: Segmented Arc Brackets (Rotating Reverse) */}
        <svg
          className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin-reverse-slow pointer-events-none"
          viewBox="0 0 280 280"
        >
          {/* Top Arc */}
          <path
            d="M 60 70 A 120 120 0 0 1 220 70"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeDasharray="25 15 5 15"
          />
          {/* Bottom Arc */}
          <path
            d="M 60 210 A 120 120 0 0 0 220 210"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeDasharray="25 15 5 15"
          />
          {/* Left and Right Accent Dots */}
          <circle cx="20" cy="140" r="3" fill="#38bdf8" />
          <circle cx="260" cy="140" r="3" fill="#38bdf8" />
        </svg>

        {/* Layer 3: Tech Ring with Segment Cutouts */}
        <div
          className="absolute inset-5 rounded-full border border-cyan-400/40 animate-spin-medium pointer-events-none"
          style={{
            borderTopColor: '#00f0ff',
            borderRightColor: 'transparent',
            borderBottomColor: '#0080ff',
            borderLeftColor: 'transparent',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
          }}
        />

        {/* Layer 4: Cyan Bevel Rim */}
        <div className="absolute inset-9 rounded-full border-2 border-cyan-300/60 bg-gradient-to-b from-cyan-950/40 to-slate-950/80 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center">
          {/* Central Reactor Orb */}
          <div
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-cyan-900 via-blue-900 to-indigo-950 border-2 border-cyan-400 flex flex-col items-center justify-center relative cursor-pointer transform active:scale-95 transition-all shadow-[0_0_35px_rgba(0,240,255,0.7),inset_0_0_20px_rgba(0,240,255,0.4)]"
            onClick={onToggleMic}
            title="Click to toggle Vivek voice listening"
          >
            {/* Core Radial Flares */}
            <div className="absolute inset-2 rounded-full border border-cyan-300/40 animate-ping opacity-30" style={{ animationDuration: '3s' }} />

            {/* Glowing Futuristic 'V' Logo */}
            <div className="relative z-10 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_#00f0ff]">
                <defs>
                  <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#0066ff" />
                  </linearGradient>
                </defs>
                {/* Outer V Shield Wing */}
                <path
                  d="M 22 28 L 50 82 L 78 28 L 66 28 L 50 63 L 34 28 Z"
                  fill="url(#vGrad)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Inner Core V Glow */}
                <path
                  d="M 38 34 L 50 58 L 62 34 Z"
                  fill="#ffffff"
                  opacity="0.85"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Status Beneath the Reactor */}
      <div className="mt-3 text-center">
        <h3 className="text-sm sm:text-base font-extrabold tracking-widest text-cyan-200 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
          VIVEK AI
        </h3>
        <p className="text-xs font-semibold tracking-wider text-cyan-400/90 mt-0.5">
          {getStateText()}
        </p>
      </div>

      {/* Dynamic Audio Waveform */}
      <div className="flex items-center justify-center gap-1 h-7 my-2.5 px-4">
        {Array.from({ length: 22 }).map((_, i) => {
          const centerDist = Math.abs(i - 11) / 11;
          const bellCurve = Math.cos(centerDist * Math.PI * 0.5);
          const barHeight = isListening || isSpeaking
            ? Math.max(3, Math.sin(i * 0.7 + Date.now() * 0.006) * 5 + (amplitude || 0.4) * 22 * bellCurve)
            : 3;

          return (
            <div
              key={i}
              className="w-0.75 sm:w-1 rounded-full bg-gradient-to-t from-cyan-500 via-sky-400 to-blue-300 transition-all duration-75"
              style={{
                height: `${Math.min(26, Math.max(3, barHeight))}px`,
                boxShadow: isListening || isSpeaking ? '0 0 6px rgba(0, 240, 255, 0.8)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Primary Microphone Action Hub (Matching Reference Image) */}
      <div className="flex items-center justify-center gap-4 mt-1">
        {/* Left Wave Icon Bars */}
        <div className="flex items-center gap-1 opacity-70">
          <span className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
          <span className="w-1 h-5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
          <span className="w-1 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Big Circular Mic Button */}
        <button
          onClick={onToggleMic}
          className={`relative p-4 sm:p-5 rounded-full transition-all duration-300 transform active:scale-95 flex items-center justify-center shadow-xl border ${
            isListening
              ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white border-white shadow-[0_0_25px_rgba(0,240,255,0.9)] ring-4 ring-cyan-400/40'
              : 'bg-gradient-to-tr from-cyan-950 via-slate-900 to-blue-950 text-cyan-300 border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          }`}
          title={isListening ? 'Stop Listening' : 'Tap to Speak'}
        >
          {isListening ? (
            <Mic className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse text-white" />
          ) : (
            <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300" />
          )}
        </button>

        {/* Right Wave Icon Bars */}
        <div className="flex items-center gap-1 opacity-70">
          <span className="w-1 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          <span className="w-1 h-5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
          <span className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Stop / Interrupt if speaking */}
      {isSpeaking && onInterrupt && (
        <button
          onClick={onInterrupt}
          className="mt-2 text-[11px] px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>Stop Voice</span>
        </button>
      )}

      {/* Bottom Subtitle Caption */}
      <p className="text-[11px] font-medium tracking-wide text-cyan-300/70 mt-2">
        Tap to speak or say "Hey Vivek"
      </p>
    </div>
  );
};
