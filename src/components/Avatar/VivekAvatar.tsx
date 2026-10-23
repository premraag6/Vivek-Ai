import React, { useEffect, useState } from 'react';
import { AvatarState } from '../../types/assistant';

interface VivekAvatarProps {
  state: AvatarState;
  amplitude?: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg' | 'xl';
  reducedMotion?: boolean;
  className?: string;
}

export const VivekAvatar: React.FC<VivekAvatarProps> = ({
  state,
  amplitude = 0,
  size = 'md',
  reducedMotion = false,
  className = '',
}) => {
  const [blink, setBlink] = useState(false);

  // Organic blinking rhythm
  useEffect(() => {
    if (reducedMotion) return;
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
      const nextDelay = 3000 + Math.random() * 4000;
      blinkTimer = setTimeout(triggerBlink, nextDelay);
    };

    let blinkTimer = setTimeout(triggerBlink, 3500);
    return () => clearTimeout(blinkTimer);
  }, [reducedMotion]);

  // Dimensions
  const dimensionMap = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52',
  };

  const dimClass = dimensionMap[size];

  // State aura colors & gradients
  const getColors = () => {
    switch (state) {
      case 'listening':
        return {
          bg: 'from-emerald-500 via-teal-500 to-cyan-500',
          glow: 'rgba(16, 185, 129, 0.45)',
          eyeColor: '#10b981',
          ringColor: 'border-emerald-400',
        };
      case 'thinking':
        return {
          bg: 'from-purple-600 via-indigo-600 to-violet-500',
          glow: 'rgba(147, 51, 234, 0.45)',
          eyeColor: '#a855f7',
          ringColor: 'border-purple-400',
        };
      case 'speaking':
        return {
          bg: 'from-blue-600 via-indigo-500 to-sky-400',
          glow: 'rgba(59, 130, 246, 0.5)',
          eyeColor: '#38bdf8',
          ringColor: 'border-blue-400',
        };
      case 'happy':
        return {
          bg: 'from-amber-400 via-yellow-500 to-orange-500',
          glow: 'rgba(245, 158, 11, 0.55)',
          eyeColor: '#f59e0b',
          ringColor: 'border-amber-300',
        };
      case 'empathetic':
        return {
          bg: 'from-rose-400 via-pink-500 to-purple-500',
          glow: 'rgba(244, 63, 94, 0.45)',
          eyeColor: '#fb7185',
          ringColor: 'border-rose-300',
        };
      case 'focused':
        return {
          bg: 'from-cyan-500 via-blue-600 to-indigo-700',
          glow: 'rgba(6, 182, 212, 0.5)',
          eyeColor: '#22d3ee',
          ringColor: 'border-cyan-400',
        };
      case 'error':
        return {
          bg: 'from-red-600 via-rose-600 to-orange-600',
          glow: 'rgba(239, 68, 68, 0.5)',
          eyeColor: '#f87171',
          ringColor: 'border-red-400',
        };
      case 'idle':
      default:
        return {
          bg: 'from-indigo-600 via-blue-600 to-indigo-800',
          glow: 'rgba(99, 102, 241, 0.35)',
          eyeColor: '#818cf8',
          ringColor: 'border-indigo-400',
        };
    }
  };

  const colors = getColors();

  // Dynamic mouth height based on speaking amplitude
  const mouthHeight = state === 'speaking' ? Math.max(4, amplitude * 24) : state === 'happy' ? 12 : 4;
  const mouthWidth = state === 'speaking' ? 24 + amplitude * 12 : state === 'happy' ? 28 : 20;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Outer ambient pulsing ripple for listening / speaking / happy */}
      {!reducedMotion && (state === 'listening' || state === 'speaking' || state === 'happy') && (
        <div
          className={`absolute inset-0 rounded-full animate-ping opacity-25`}
          style={{
            backgroundColor: colors.glow,
            animationDuration: state === 'listening' ? '1.5s' : '2s',
          }}
        />
      )}

      {/* Orbiting ring for thinking */}
      {!reducedMotion && state === 'thinking' && (
        <div className="absolute -inset-2.5 rounded-full border-2 border-dashed border-purple-400/60 animate-spin" style={{ animationDuration: '4s' }} />
      )}

      {/* Main Avatar Container */}
      <div
        className={`${dimClass} relative rounded-full bg-gradient-to-tr ${colors.bg} p-1 shadow-2xl transition-all duration-500 flex items-center justify-center`}
        style={{
          boxShadow: `0 0 25px ${colors.glow}`,
          transform: !reducedMotion && state === 'speaking' ? `scale(${1 + amplitude * 0.08})` : 'scale(1)',
        }}
      >
        {/* Inner face disc */}
        <div className="w-full h-full rounded-full bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
          {/* Subtle forehead neural glyph / shine */}
          <div className="absolute top-2 w-3 h-1 bg-white/20 rounded-full blur-[1px]" />

          {/* Eyes Container */}
          <div className="flex items-center justify-center gap-4 transition-all duration-300 mb-1.5">
            {/* Left Eye */}
            <div
              className={`rounded-full transition-all duration-200 flex items-center justify-center`}
              style={{
                width: size === 'sm' ? 4 : size === 'md' ? 8 : 12,
                height: blink
                  ? 1
                  : state === 'happy'
                  ? size === 'sm' ? 2 : 4
                  : size === 'sm' ? 4 : size === 'md' ? 8 : 12,
                backgroundColor: colors.eyeColor,
                boxShadow: `0 0 8px ${colors.eyeColor}`,
                transform: state === 'thinking' ? 'translateY(-2px)' : 'none',
              }}
            >
              {!blink && size !== 'sm' && (
                <div className="w-1 h-1 bg-white rounded-full opacity-80" />
              )}
            </div>

            {/* Right Eye */}
            <div
              className={`rounded-full transition-all duration-200 flex items-center justify-center`}
              style={{
                width: size === 'sm' ? 4 : size === 'md' ? 8 : 12,
                height: blink
                  ? 1
                  : state === 'happy'
                  ? size === 'sm' ? 2 : 4
                  : size === 'sm' ? 4 : size === 'md' ? 8 : 12,
                backgroundColor: colors.eyeColor,
                boxShadow: `0 0 8px ${colors.eyeColor}`,
                transform: state === 'thinking' ? 'translateY(-2px)' : 'none',
              }}
            >
              {!blink && size !== 'sm' && (
                <div className="w-1 h-1 bg-white rounded-full opacity-80" />
              )}
            </div>
          </div>

          {/* Mouth / Voice Wave */}
          {size !== 'sm' && (
            <div className="flex items-center justify-center h-5 mt-0.5">
              {state === 'happy' ? (
                // Cheerful Smile Curve
                <svg width={mouthWidth} height="12" viewBox="0 0 30 12" className="text-amber-300">
                  <path
                    d="M 3 3 Q 15 12 27 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : state === 'empathetic' ? (
                // Soft Caring Smile
                <svg width={mouthWidth} height="8" viewBox="0 0 30 8" className="text-rose-300">
                  <path
                    d="M 5 2 Q 15 7 25 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : state === 'speaking' ? (
                // Dynamic Acoustic Mouth Bar / Capsule
                <div
                  className="rounded-full bg-cyan-300 transition-all duration-75 shadow-sm"
                  style={{
                    width: mouthWidth,
                    height: Math.max(3, mouthHeight),
                    boxShadow: `0 0 10px ${colors.eyeColor}`,
                  }}
                />
              ) : state === 'listening' ? (
                // Subtle listening sound wave line
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              ) : state === 'error' ? (
                // Apologetic flat mouth
                <div className="w-4 h-0.5 bg-red-400 rounded-full" />
              ) : (
                // Idle neutral gentle curve
                <div className="w-4 h-1 bg-indigo-300/60 rounded-full" />
              )}
            </div>
          )}

          {/* State badge on the bottom right edge */}
          {size !== 'sm' && (
            <div className="absolute bottom-1 text-[8px] font-semibold tracking-wider uppercase text-white/50">
              {state}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
