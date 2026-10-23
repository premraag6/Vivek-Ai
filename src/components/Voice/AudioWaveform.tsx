import React from 'react';

interface AudioWaveformProps {
  active: boolean;
  amplitude?: number; // 0 to 1
  bars?: number;
  color?: string;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  active,
  amplitude = 0.5,
  bars = 16,
  color = 'from-cyan-400 to-indigo-500',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-1 h-8 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        // Compute pseudo wave heights
        const centerOffset = Math.abs(i - bars / 2) / (bars / 2);
        const waveFactor = Math.cos(centerOffset * Math.PI * 0.5);
        const dynamicHeight = active
          ? Math.max(4, Math.sin(i * 0.6 + Date.now() * 0.005) * 6 + amplitude * 28 * waveFactor)
          : 3;

        return (
          <div
            key={i}
            className={`w-1 rounded-full bg-gradient-to-t ${color} transition-all duration-75`}
            style={{
              height: `${Math.min(32, Math.max(3, dynamicHeight))}px`,
              opacity: active ? 0.7 + (i % 2) * 0.3 : 0.25,
            }}
          />
        );
      })}
    </div>
  );
};
