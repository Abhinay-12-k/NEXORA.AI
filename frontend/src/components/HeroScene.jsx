import { useEffect, useRef } from 'react';

/**
 * HeroScene — Full-page 3D canvas animation
 *
 * Renders a real-time 3D scene using perspective projection:
 *   - Fibonacci-distributed neural-network sphere (200 nodes + edges)
 *   - Hemisphere lighting (front-facing nodes brightest)
 *   - Three orbital rings with scattered particles at different tilts
 *   - 300-star depth-sorted background
 *   - 50 free-floating neon data particles
 *   - Mouse-driven rotation offset
 *   - Periodic energy-pulse rings expanding from sphere centre
 */

/* ── 3D maths ───────────────────────────────────────────────── */
const ry = (x, y, z, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
};
const rx = (x, y, z, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
};
const project = (x, y, z, cx, cy) => {
  const fov = 580;
  const dz = fov + z + 420;
  if (dz <= 0) return { sx: cx, sy: cy, scale: 0 };
  const scale = fov / dz;
  return { sx: x * scale + cx, sy: y * scale + cy, scale };
};
const clampR = (v) => Math.max(0.15, v);

/* ── Build sphere nodes via Fibonacci lattice ───────────────── */
const buildSphere = (n, R) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const th = Math.acos(1 - (2 * (i + 0.5)) / n);
    const p  = 2 * Math.PI * i / phi;
    return {
      ox: R * Math.sin(th) * Math.cos(p),
      oy: R * Math.sin(th) * Math.sin(p),
      oz: R * Math.cos(th),
      r:  Math.random() * 1.5 + 0.8,
      phase: Math.random() * Math.PI * 2,
      spd:   Math.random() * 0.018 + 0.007,
    };
  });
};

/* ── Build connection list (neighbours within threshold) ─────── */
const buildEdges = (nodes, threshold, limit) => {
  const edges = [];
  for (let i = 0; i < nodes.length && edges.length < limit; i++) {
    for (let j = i + 1; j < nodes.length && edges.length < limit; j++) {
      const dx = nodes[i].ox - nodes[j].ox;
      const dy = nodes[i].oy - nodes[j].oy;
      const dz = nodes[i].oz - nodes[j].oz;
      const d  = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < threshold) edges.push([i, j, d]);
    }
  }
  return edges;
};

/* ── Ring config ────────────────────────────────────────────── */
const RING_DEFS = [
  { tilt: Math.PI * 0.14,  radius: 245, count: 72, rgb: [99,  102, 241], spd:  0.0028 },
  { tilt: -Math.PI * 0.38, radius: 290, count: 58, rgb: [6,   182, 212], spd: -0.002  },
  { tilt: Math.PI * 0.62,  radius: 205, count: 46, rgb: [139,  92, 246], spd:  0.0038 },
];

/* ── Component ──────────────────────────────────────────────── */
const HeroScene = () => {
  const canvasRef = useRef(null);
  const mouse     = useRef({ x: 0, y: 0 });
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    /* Resize with devicePixelRatio */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left) / r.width  - 0.5;
      mouse.current.y = (e.clientY - r.top)  / r.height - 0.5;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    /* ── Scene data ─────────────────────────────────────────── */
    const SPHERE_R = 190;
    const sphereNodes = buildSphere(200, SPHERE_R);
    const edges       = buildEdges(sphereNodes, 52, 720);

    /* Ring particles */
    const ringPts = RING_DEFS.flatMap(cfg =>
      Array.from({ length: cfg.count }, (_, i) => ({
        cfg,
        angle: (i / cfg.count) * Math.PI * 2,
        r:   cfg.radius + (Math.random() - 0.5) * 28,
        sz:  Math.random() * 2.4 + 0.6,
        op:  Math.random() * 0.55 + 0.35,
      }))
    );

    /* Star field */
    const stars = Array.from({ length: 320 }, () => ({
      x:  (Math.random() - 0.5) * 2200,
      y:  (Math.random() - 0.5) * 1400,
      z:  Math.random() * 700 + 500,
      r:  Math.random() * 1.1 + 0.2,
      tw: Math.random() * Math.PI * 2,
    }));

    /* Free-floating neon particles */
    const floaters = Array.from({ length: 55 }, () => ({
      x: (Math.random() - 0.5) * 720,
      y: (Math.random() - 0.5) * 720,
      z: (Math.random() - 0.5) * 520,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      vz: (Math.random() - 0.5) * 0.28,
      r:  Math.random() * 1.8 + 0.5,
      hue: Math.random() > 0.5 ? [99, 102, 241] : [6, 182, 212],
      ph:  Math.random() * Math.PI * 2,
    }));

    /* Energy-pulse rings */
    const MAX_PULSES = 4;
    const pulses = Array.from({ length: MAX_PULSES }, () => ({
      r: 0, op: 0, alive: false,
    }));
    let nextPulse = 2.5;

    /* ── Draw loop ──────────────────────────────────────────── */
    const draw = () => {
      const W  = canvas.offsetWidth;
      const H  = canvas.offsetHeight;
      const cx = W / 2;
      const cy = H / 2;

      tRef.current += 0.0075;
      const t   = tRef.current;
      const mx  = mouse.current.x;
      const my  = mouse.current.y;

      /* Total rotation angles */
      const ry_a = t * 0.42 + mx * 0.65;
      const rx_a = my * 0.38 - 0.08;

      ctx.clearRect(0, 0, W, H);

      /* ── 1. Stars ───────────────────────────────────────── */
      for (const s of stars) {
        s.tw += 0.014;
        /* Stars barely rotate with scene for subtle parallax */
        let [sx, sy, sz] = ry(s.x, s.y, s.z, ry_a * 0.06);
        [sx, sy, sz] = rx(sx, sy, sz, rx_a * 0.06);
        const p = project(sx, sy, sz, cx, cy);
        if (p.scale <= 0) continue;
        const op = Math.min(1, (0.18 + Math.sin(s.tw) * 0.22) * p.scale * 3.5);
        ctx.beginPath();
        ctx.fillStyle = `rgba(195,210,255,${op})`;
        ctx.arc(p.sx, p.sy, clampR(s.r * p.scale * 2.2), 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── 2. Free-floating neon particles ────────────────── */
      for (const f of floaters) {
        f.x += f.vx; f.y += f.vy; f.z += f.vz; f.ph += 0.024;
        if (Math.abs(f.x) > 460) f.vx *= -1;
        if (Math.abs(f.y) > 460) f.vy *= -1;
        if (Math.abs(f.z) > 360) f.vz *= -1;
        let [fx, fy, fz] = ry(f.x, f.y, f.z, ry_a);
        [fx, fy, fz] = rx(fx, fy, fz, rx_a);
        const p = project(fx, fy, fz, cx, cy);
        if (p.scale <= 0) continue;
        const op  = Math.min(0.85, (0.45 + Math.sin(f.ph) * 0.35) * p.scale * 2.8);
        const [r, g, b] = f.hue;
        const gr = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, clampR(f.r * p.scale * 9));
        gr.addColorStop(0, `rgba(${r},${g},${b},${op * 0.65})`);
        gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.fillStyle = gr;
        ctx.arc(p.sx, p.sy, clampR(f.r * p.scale * 9), 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${op})`;
        ctx.arc(p.sx, p.sy, clampR(f.r * p.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── 3. Orbital ring particles ──────────────────────── */
      for (const rp of ringPts) {
        rp.angle += rp.cfg.spd;
        const co = Math.cos(rp.angle), si = Math.sin(rp.angle);
        const ct = Math.cos(rp.cfg.tilt), st = Math.sin(rp.cfg.tilt);
        const x0 = rp.r * co;
        const y0 = rp.r * si * ct;
        const z0 = rp.r * si * st;
        let [xr, yr, zr] = ry(x0, y0, z0, ry_a);
        [xr, yr, zr] = rx(xr, yr, zr, rx_a);
        const p = project(xr, yr, zr, cx, cy);
        if (p.scale <= 0) continue;
        const op  = Math.min(1, rp.op * p.scale * 2.8);
        const [r, g, b] = rp.cfg.rgb;
        /* Glow halo */
        const haloR = clampR(rp.sz * p.scale * 5);
        const glow  = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, haloR);
        glow.addColorStop(0, `rgba(${r},${g},${b},${op * 0.5})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(p.sx, p.sy, haloR, 0, Math.PI * 2);
        ctx.fill();
        /* Core dot */
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${op})`;
        ctx.arc(p.sx, p.sy, clampR(rp.sz * p.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── 4. Project sphere nodes ────────────────────────── */
      const sProj = sphereNodes.map(n => {
        n.phase += n.spd;
        let [xr, yr, zr] = ry(n.ox, n.oy, n.oz, ry_a);
        [xr, yr, zr] = rx(xr, yr, zr, rx_a);
        const p = project(xr, yr, zr, cx, cy);
        /* Lighting: zr ∈ [-SPHERE_R, +SPHERE_R] → light ∈ [0, 1] */
        const light = Math.max(0, Math.min(1, (zr + SPHERE_R) / (2 * SPHERE_R)));
        return { ...p, zr, light, n };
      });

      /* ── 5. Sphere edges ────────────────────────────────── */
      ctx.save();
      for (const [i, j, d] of edges) {
        const a = sProj[i], b = sProj[j];
        const avgScale = (a.scale + b.scale) * 0.5;
        const avgLight = (a.light  + b.light)  * 0.5;
        if (avgScale < 0.18 || avgLight < 0.05) continue;
        const alpha = (1 - d / 52) * avgScale * (0.25 + avgLight * 0.65);
        if (alpha < 0.015) continue;
        /* Gradient from indigo → violet → cyan based on position */
        const g = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
        g.addColorStop(0, `rgba(99,102,241,${alpha})`);
        g.addColorStop(0.5, `rgba(168,85,247,${Math.min(1, alpha * 1.5)})`);
        g.addColorStop(1, `rgba(6,182,212,${alpha})`);
        ctx.beginPath();
        ctx.strokeStyle = g;
        ctx.lineWidth   = avgScale * 1.05;
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
      ctx.restore();

      /* ── 6. Sphere nodes (depth-sorted, back → front) ───── */
      const sorted = [...sProj].sort((a, b) => a.zr - b.zr);
      for (const p of sorted) {
        if (p.scale < 0.12) continue;
        const pr = clampR((p.n.r + Math.sin(p.n.phase) * 0.85) * p.scale * 3.2);

        /* Outer glow — only on lit hemisphere */
        if (p.light > 0.3) {
          const glowR = clampR(pr * 7);
          const glow  = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowR);
          glow.addColorStop(0, `rgba(99,102,241,${0.38 * p.light * p.scale})`);
          glow.addColorStop(1, 'rgba(99,102,241,0)');
          ctx.beginPath();
          ctx.fillStyle = glow;
          ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        /* Node body — hemisphere shading */
        const bodyAlpha = 0.45 + p.light * 0.55;
        const r1 = Math.max(0, 99  - p.light * 30);
        const g1 = Math.max(0, 102 - p.light * 20);
        const b1 = Math.min(255, 241 + p.light * 14);
        const bodyGrad = ctx.createRadialGradient(
          p.sx - pr * 0.28, p.sy - pr * 0.28, 0,
          p.sx, p.sy, pr
        );
        bodyGrad.addColorStop(0, `rgba(${Math.round(167 + p.light*40)},${Math.round(139+p.light*30)},250,${bodyAlpha})`);
        bodyGrad.addColorStop(1, `rgba(${Math.round(r1)},${Math.round(g1)},${Math.round(b1)},${bodyAlpha * 0.7})`);
        ctx.beginPath();
        ctx.fillStyle = bodyGrad;
        ctx.arc(p.sx, p.sy, pr, 0, Math.PI * 2);
        ctx.fill();

        /* Specular highlight — only very front-facing nodes */
        if (p.light > 0.65) {
          const specAlpha = (p.light - 0.65) * 2.5 * p.scale;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${Math.min(0.9, specAlpha)})`;
          ctx.arc(p.sx, p.sy, clampR(pr * 0.32), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ── 7. Energy-pulse rings (2D screen-space) ─────────── */
      if (t > nextPulse) {
        nextPulse = t + 3.2;
        for (const pulse of pulses) {
          if (!pulse.alive) {
            pulse.r     = SPHERE_R * 0.15;
            pulse.op    = 0.7;
            pulse.alive = true;
            break;
          }
        }
      }
      const sphereScreen = project(0, 0, 0, cx, cy);
      for (const pulse of pulses) {
        if (!pulse.alive) continue;
        pulse.r  += 2.2;
        pulse.op *= 0.978;
        if (pulse.r > SPHERE_R * 2.6 || pulse.op < 0.012) {
          pulse.alive = false;
          continue;
        }
        const screenR = clampR(pulse.r * sphereScreen.scale);
        /* Outer soft ring */
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${pulse.op * 0.35})`;
        ctx.lineWidth   = 4;
        ctx.arc(sphereScreen.sx, sphereScreen.sy, screenR, 0, Math.PI * 2);
        ctx.stroke();
        /* Inner crisp ring */
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139,92,246,${pulse.op})`;
        ctx.lineWidth   = 1.2;
        ctx.arc(sphereScreen.sx, sphereScreen.sy, screenR, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export default HeroScene;
