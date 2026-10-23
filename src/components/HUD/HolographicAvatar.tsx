import React from 'react';
import { AvatarState } from '../../types/assistant';

interface HolographicAvatarProps {
  state: AvatarState;
  className?: string;
  onClick?: () => void;
}

export const HolographicAvatar: React.FC<HolographicAvatarProps> = ({
  state,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center select-none cursor-pointer group ${className}`}
      title="Vivek - Your Intelligent Companion"
    >
      {/* City wireframe grid background illustration */}
      <div className="absolute -bottom-6 w-36 h-20 opacity-30 pointer-events-none overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 160 80" className="w-full h-full text-cyan-400">
          {/* Wireframe skyscrapers */}
          <rect x="10" y="30" width="16" height="50" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="40" x2="26" y2="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="50" x2="26" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="60" x2="26" y2="60" stroke="currentColor" strokeWidth="0.5" />

          <rect x="30" y="15" width="22" height="65" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="30" y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="45" x2="52" y2="45" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="60" x2="52" y2="60" stroke="currentColor" strokeWidth="0.5" />

          <rect x="56" y="24" width="20" height="56" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="56" y1="38" x2="76" y2="38" stroke="currentColor" strokeWidth="0.5" />
          <line x1="56" y1="52" x2="76" y2="52" stroke="currentColor" strokeWidth="0.5" />

          <rect x="80" y="10" width="26" height="70" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="80" y1="25" x2="106" y2="25" stroke="currentColor" strokeWidth="0.5" />
          <line x1="80" y1="40" x2="106" y2="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="80" y1="55" x2="106" y2="55" stroke="currentColor" strokeWidth="0.5" />

          <rect x="110" y="32" width="18" height="48" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="132" y="20" width="18" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Outer Holographic Pedestal / Target Ring */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-cyan-400 via-blue-600 to-cyan-900 shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] transition-all">
        {/* Rotating radar tick brackets */}
        <div className="absolute -inset-1.5 rounded-full border border-dashed border-cyan-400/50 animate-spin-slow pointer-events-none" />

        {/* Inner Portrait Frame */}
        <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden relative border border-cyan-300/60 flex items-center justify-center">
          {/* High-fidelity stylized SVG Avatar portrait matching reference */}
          <svg viewBox="0 0 100 100" className="w-full h-full transform scale-110">
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f7d4b2" />
                <stop offset="100%" stopColor="#d99b70" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
            </defs>

            {/* Suit & Collar */}
            <path d="M 20 100 L 25 78 L 38 72 L 50 82 L 62 72 L 75 78 L 80 100 Z" fill="url(#suitGrad)" />
            {/* Cyan glowing suit line */}
            <path d="M 38 72 L 50 82 L 62 72" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
            <circle cx="50" cy="85" r="3" fill="#00f0ff" />

            {/* Neck */}
            <path d="M 42 64 L 58 64 L 56 75 L 44 75 Z" fill="url(#skinGrad)" />

            {/* Head / Face */}
            <path
              d="M 32 40 C 32 25 40 22 50 22 C 60 22 68 25 68 40 C 68 56 60 67 50 67 C 40 67 32 56 32 40 Z"
              fill="url(#skinGrad)"
            />

            {/* Hair */}
            <path
              d="M 30 36 C 30 20 40 14 52 14 C 64 14 70 20 70 32 C 68 30 63 32 58 28 C 50 26 44 28 38 34 C 33 34 31 35 30 36 Z"
              fill="url(#hairGrad)"
            />
            {/* Hair Side Volume */}
            <path d="M 31 34 Q 30 46 34 46 Q 34 38 36 34 Z" fill="url(#hairGrad)" />
            <path d="M 69 32 Q 70 44 66 44 Q 66 36 64 32 Z" fill="url(#hairGrad)" />

            {/* Eyebrows */}
            <path d="M 38 37 Q 44 35 47 38" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 53 38 Q 56 35 62 37" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />

            {/* Eyes */}
            <ellipse cx="43" cy="42" rx="3.5" ry="2" fill="#ffffff" />
            <circle cx="43.5" cy="42" r="1.5" fill="#0f172a" />
            <circle cx="44" cy="41.5" r="0.5" fill="#ffffff" />

            <ellipse cx="57" cy="42" rx="3.5" ry="2" fill="#ffffff" />
            <circle cx="56.5" cy="42" r="1.5" fill="#0f172a" />
            <circle cx="57" cy="41.5" r="0.5" fill="#ffffff" />

            {/* Nose */}
            <path d="M 50 42 L 48 50 L 52 50" fill="none" stroke="#c08259" strokeWidth="1" strokeLinecap="round" />

            {/* Warm Friendly Smile */}
            <path
              d={state === 'happy' ? 'M 44 54 Q 50 62 56 54' : 'M 45 55 Q 50 59 55 55'}
              fill="none"
              stroke="#b91c1c"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Label & Subtitle */}
      <div className="text-center mt-1.5 z-10">
        <span className="text-xs font-black tracking-widest text-cyan-300 uppercase block drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
          VIVEK
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          Always with you
        </span>
      </div>
    </div>
  );
};
