import { useEffect, useRef } from 'react';

const CareerCanvas = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let t = 0;

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    // Milestones along the bezier path
    const milestones = [
      { t: 0.05, label: 'Onboard', color: '#6366f1', icon: '🚀' },
      { t: 0.33, label: 'Performing', color: '#8b5cf6', icon: '⚡' },
      { t: 0.63, label: 'Excellence', color: '#06b6d4', icon: '🎯' },
      { t: 0.92, label: 'Hire-Ready', color: '#10b981', icon: '✓' },
    ];

    // Stars/particles
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.001 + 0.0003,
      opacity: Math.random() * 0.6 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
    }));

    // Cubic bezier point
    const bez = (u, p0, p1, p2, p3) => {
      const m = 1 - u;
      return m * m * m * p0 + 3 * m * m * u * p1 + 3 * m * u * u * p2 + u * u * u * p3;
    };

    // Trailing particles on the orb
    const trail = [];

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      t += 0.004;

      // Stars
      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        s.y -= s.speed;
        if (s.y < 0) { s.y = 1; s.x = Math.random(); }
        const op = s.opacity * (0.55 + Math.sin(s.twinkle) * 0.45);
        ctx.beginPath();
        ctx.fillStyle = `rgba(180,195,255,${op})`;
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bezier control points
      const x0 = w * 0.08, y0 = h * 0.9;
      const x1 = w * 0.28, y1 = h * 0.58;
      const x2 = w * 0.62, y2 = h * 0.28;
      const x3 = w * 0.92, y3 = h * 0.08;

      // Thick glow trail
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
      ctx.strokeStyle = 'rgba(139,92,246,0.12)';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Medium glow
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
      ctx.strokeStyle = 'rgba(99,102,241,0.2)';
      ctx.lineWidth = 7;
      ctx.stroke();

      // Main line
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
      const lg = ctx.createLinearGradient(x0, y0, x3, y3);
      lg.addColorStop(0, 'rgba(99,102,241,0.95)');
      lg.addColorStop(0.45, 'rgba(139,92,246,0.95)');
      lg.addColorStop(0.75, 'rgba(6,182,212,0.95)');
      lg.addColorStop(1, 'rgba(16,185,129,0.95)');
      ctx.strokeStyle = lg;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Milestones
      milestones.forEach((m, i) => {
        const mx = bez(m.t, x0, x1, x2, x3);
        const my = bez(m.t, y0, y1, y2, y3);
        const pulse = Math.sin(t * 2.2 + i * 1.6) * 3;

        // Outer ring pulse
        ctx.beginPath();
        const og = ctx.createRadialGradient(mx, my, 0, mx, my, 34 + pulse);
        og.addColorStop(0, m.color + '30');
        og.addColorStop(1, 'transparent');
        ctx.fillStyle = og;
        ctx.arc(mx, my, 34 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner ring
        ctx.beginPath();
        ctx.strokeStyle = m.color + '55';
        ctx.lineWidth = 1.2;
        ctx.arc(mx, my, 19 + pulse * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Core
        const cg = ctx.createRadialGradient(mx - 3, my - 3, 0, mx, my, 11);
        cg.addColorStop(0, 'rgba(255,255,255,0.95)');
        cg.addColorStop(1, m.color);
        ctx.beginPath();
        ctx.fillStyle = cg;
        ctx.arc(mx, my, 11, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = `700 11px Inter, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(210,215,255,0.95)';
        ctx.fillText(m.label, mx, my - 24);

        ctx.font = `800 11px Inter, -apple-system, sans-serif`;
        ctx.fillStyle = m.color;
        ctx.fillText(m.icon, mx, my + 30);
      });

      // Animated orb along trajectory
      const orbT = (t * 0.13) % 1;
      const orbX = bez(orbT, x0, x1, x2, x3);
      const orbY = bez(orbT, y0, y1, y2, y3);

      // Keep trail
      trail.push({ x: orbX, y: orbY, age: 0 });
      if (trail.length > 18) trail.shift();

      // Draw trail
      trail.forEach((p, i) => {
        const a = (i / trail.length) * 0.5;
        const r = (i / trail.length) * 4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(6,182,212,${a})`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Orb glow
      const orbGlow = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 22);
      orbGlow.addColorStop(0, 'rgba(6,182,212,0.7)');
      orbGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.fillStyle = orbGlow;
      ctx.arc(orbX, orbY, 22, 0, Math.PI * 2);
      ctx.fill();

      // Orb core
      ctx.beginPath();
      ctx.fillStyle = '#06b6d4';
      ctx.arc(orbX, orbY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.arc(orbX, orbY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
};

export default CareerCanvas;
