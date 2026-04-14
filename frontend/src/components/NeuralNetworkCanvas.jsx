import { useEffect, useRef } from 'react';

const NeuralNetworkCanvas = ({ className = '', nodeCount = 55, maxDist = 120 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;

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

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2.2 + 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.018 + 0.008,
    }));

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const a = (1 - dist / maxDist) * 0.55;
            const g = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            g.addColorStop(0, `rgba(99,102,241,${a})`);
            g.addColorStop(0.5, `rgba(168,85,247,${a * 1.3})`);
            g.addColorStop(1, `rgba(6,182,212,${a})`);
            ctx.beginPath();
            ctx.strokeStyle = g;
            ctx.lineWidth = 0.9;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        n.phase += n.speed;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const pr = Math.max(0.5, n.r + Math.sin(n.phase) * 1.4);

        // Outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 9);
        glow.addColorStop(0, `rgba(99,102,241,${0.35 + Math.sin(n.phase) * 0.1})`);
        glow.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(n.x, n.y, pr * 9, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        const cg = ctx.createRadialGradient(n.x - pr * 0.3, n.y - pr * 0.3, 0, n.x, n.y, pr);
        cg.addColorStop(0, `rgba(167,139,250,${0.9 + Math.sin(n.phase) * 0.1})`);
        cg.addColorStop(1, `rgba(99,102,241,${0.7 + Math.sin(n.phase) * 0.2})`);
        ctx.beginPath();
        ctx.fillStyle = cg;
        ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
        ctx.fill();

        // Bright inner
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.85 + Math.sin(n.phase) * 0.1})`;
        ctx.arc(n.x, n.y, pr * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      ro.disconnect();
    };
  }, [nodeCount, maxDist]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
};

export default NeuralNetworkCanvas;
