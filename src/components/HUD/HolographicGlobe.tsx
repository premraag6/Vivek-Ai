import React, { useEffect, useRef } from 'react';

interface HolographicGlobeProps {
  className?: string;
  size?: number;
}

export const HolographicGlobe: React.FC<HolographicGlobeProps> = ({
  className = '',
  size = 72,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Generate pseudo land / point coordinates on sphere
    const points: Array<{ lat: number; lon: number }> = [];
    for (let i = 0; i < 90; i++) {
      const lat = (Math.random() - 0.5) * Math.PI;
      const lon = Math.random() * Math.PI * 2;
      points.push({ lat, lon });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = canvas.width * 0.42;

      // Outer atmosphere glow
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 1.1);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      grad.addColorStop(0.7, 'rgba(2, 132, 199, 0.4)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Sphere Outline
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw latitude lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        const rLat = (lat * Math.PI) / 180;
        const y = cy + Math.sin(rLat) * radius;
        const rx = Math.cos(rLat) * radius;
        ctx.beginPath();
        ctx.ellipse(cx, y, rx, rx * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw rotating longitude ellipses
      for (let lon = 0; lon < 180; lon += 45) {
        const rad = ((lon + rotation * 50) * Math.PI) / 180;
        const xOffset = Math.sin(rad) * radius;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(xOffset), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw rotating surface dots
      rotation += 0.01;
      ctx.fillStyle = '#38bdf8';
      for (const p of points) {
        const lon = p.lon + rotation;
        // Project onto visible hemisphere
        const x = Math.cos(p.lat) * Math.sin(lon);
        const y = Math.sin(p.lat);
        const z = Math.cos(p.lat) * Math.cos(lon);

        if (z > 0) {
          const px = cx + x * radius;
          const py = cy + y * radius;
          ctx.beginPath();
          ctx.arc(px, py, 1.2 * z, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size }}
        className="rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]"
      />
    </div>
  );
};
