import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Zap, ArrowRight, CheckCircle2, Menu, X,
  PlayCircle, Users, Globe, Star, TrendingUp, Brain,
  Award, Target, Bot, BarChart3, Cpu, ChevronDown,
} from 'lucide-react';
import VideoModal  from '../components/VideoModal';
import HeroScene   from '../components/HeroScene';
import NeuralNetworkCanvas from '../components/NeuralNetworkCanvas';

/* ══════════════════════════════════════════════════════════════
   GLOBAL KEYFRAMES  (injected once, scoped to landing page)
══════════════════════════════════════════════════════════════ */
const KEYFRAMES = `
  @keyframes lp-fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lp-fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes lp-pulse    { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.12);opacity:1} }
  @keyframes lp-badge1   { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-14px) rotate(1deg)} }
  @keyframes lp-badge2   { 0%,100%{transform:translateY(0) rotate(1deg)}   50%{transform:translateY(-10px) rotate(-1.5deg)} }
  @keyframes lp-badge3   { 0%,100%{transform:translateY(0)}                50%{transform:translateY(-8px)} }
  @keyframes lp-shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes lp-spinY    { from{transform:rotateY(0deg) rotateX(12deg)} to{transform:rotateY(360deg) rotateX(12deg)} }
  @keyframes lp-floatA   { 0%,100%{transform:rotate(45deg) translateY(0)}   50%{transform:rotate(45deg) translateY(-14px)} }
  @keyframes lp-scroll   { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(8px);opacity:0.4} }
  @keyframes lp-barFill  { from{width:0} }
  @keyframes lp-glowPing { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.4);opacity:0} }
`;

/* ══════════════════════════════════════════════════════════════
   FEATURE 3-D TILT CARD
══════════════════════════════════════════════════════════════ */
const Feature3DCard = ({ feature, delay = 0 }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    const rX = ((y - r.height / 2) / (r.height / 2)) * -11;
    const rY = ((x - r.width  / 2) / (r.width  / 2)) *  11;
    el.style.transform  = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(14px) scale(1.025)`;
    el.style.transition = 'transform 0.07s ease-out';
    if (glowRef.current)
      glowRef.current.style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(99,102,241,0.12), transparent 65%)`;
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
    el.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative p-7 bg-white rounded-3xl border border-slate-100/80 cursor-default overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
        animation: `lp-fadeUp 0.6s ${delay}ms both`,
      }}
    >
      <div ref={glowRef} className="absolute inset-0 rounded-3xl pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.045) 0%,transparent 50%,rgba(139,92,246,0.045) 100%)' }} />

      <div className={`relative w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg`}
        style={{ transform: 'translateZ(18px)' }}>
        {feature.icon}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`} />
      </div>

      <div style={{ transform: 'translateZ(9px)' }}>
        <h3 className="text-[15px] font-black text-slate-900 mb-2.5 tracking-tight">{feature.title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.description}</p>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNT-UP
══════════════════════════════════════════════════════════════ */
const CountUp = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref    = useRef(null);
  const fired  = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const steps = 60, ms = 1800;
        const inc   = target / steps;
        let cur = 0;
        const id = setInterval(() => {
          cur += inc;
          if (cur >= target) { setCount(target); clearInterval(id); }
          else setCount(Math.floor(cur));
        }, ms / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref} className="tabular-nums">{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeSection, setActive]  = useState('home');
  const [demoOpen,   setDemoOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  /* ── Feature data ─────────────────────────────────────── */
  const features = [
    {
      title: 'HireIndex™ Engine',
      description: 'AI-powered predictive scoring that evaluates engineering readiness and full-time conversion probability with surgical precision.',
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'AI Performance Coach',
      description: 'Groq-powered Llama 3.1 coach that delivers real-time personalised feedback to accelerate every intern toward excellence.',
      icon: <Brain className="w-6 h-6 text-white" />,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Secure Data Vault',
      description: 'Enterprise-grade encrypted architecture protecting performance records, assessments, and all sensitive intern data.',
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Blazing Fast Analytics',
      description: 'Real-time dashboards with sub-second data sync — no lag, no delays, just instant insights at any scale.',
      icon: <Zap className="w-6 h-6 text-white" />,
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Smart Task Management',
      description: 'Structured task assignment, deadline tracking, and completion monitoring for streamlined intern management.',
      icon: <Target className="w-6 h-6 text-white" />,
      gradient: 'from-indigo-500 to-blue-700',
    },
    {
      title: 'Role-Based Intelligence',
      description: 'Tailored workspaces for Interns, Mentors, and Admins — each with exactly the tools they need.',
      icon: <Award className="w-6 h-6 text-white" />,
      gradient: 'from-pink-500 to-rose-600',
    },
  ];

  /* ── Scroll tracking ──────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of ['home', 'features', 'about']) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 100 && bottom > 100) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goto = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Gradient-text style helper ───────────────────────── */
  const gradStyle = {
    background: 'linear-gradient(135deg,#818cf8 0%,#a78bfa 40%,#67e8f9 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'lp-shimmer 4s linear infinite',
  };

  const indStyle = {
    background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

      {/* inject keyframes once */}
      <style>{KEYFRAMES}</style>

      {/* ════════════════ NAVBAR ════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background:    scrolled ? 'rgba(2,8,23,0.75)'  : 'transparent',
          backdropFilter:scrolled ? 'blur(20px)' : 'none',
          borderBottom:  scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => goto('home')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
              <img src="/nexoralogo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">
              Nexora<span className="text-indigo-400">AI</span>
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-9">
            {['home','features','about'].map(s => (
              <button key={s} onClick={() => goto(s)}
                className={`text-sm font-bold capitalize transition-all relative ${
                  activeSection === s ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
                }`}>
                {s}
                {activeSection === s && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-indigo-400" />
                )}
              </button>
            ))}
            <button onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-300 hover:text-white transition-all">
              Login
            </button>
            <button onClick={() => navigate('/register')}
              className="px-6 py-2.5 text-white rounded-full text-sm font-black transition-all hover:scale-105"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 20px rgba(99,102,241,0.35)' }}>
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-b border-white/10 p-8 flex flex-col gap-6"
            style={{ background:'rgba(2,8,23,0.95)', backdropFilter:'blur(20px)', animation:'lp-fadeUp 0.2s ease' }}>
            {['home','features','about'].map(s => (
              <button key={s} onClick={() => goto(s)}
                className={`text-xl font-bold capitalize text-left ${
                  activeSection === s ? 'text-indigo-400' : 'text-white'}`}>
                {s}
              </button>
            ))}
            <button onClick={() => navigate('/login')} className="text-xl font-bold text-white text-left">Login</button>
            <button onClick={() => navigate('/register')}
              className="w-full py-4 text-white rounded-2xl font-black text-center"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════════════════
          HERO — full-viewport 3-D scene
      ════════════════════════════════════════════════════ */}
      <section id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#020817 0%,#0a0820 55%,#020c1b 100%)' }}>

        {/* ── 3-D canvas fills the whole section ── */}
        <HeroScene />

        {/* ── Depth radial vignette so text stays readable ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(2,8,23,0.18) 0%, rgba(2,8,23,0.55) 100%)' }} />

        {/* ── Subtle horizontal scanline overlay ── */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(255,255,255,0.6) 3px, rgba(255,255,255,0.6) 4px)',
          }} />

        {/* ── Floating ambient metric chips ── */}
        {/* top-left */}
        <div className="absolute top-32 left-6 lg:left-16 hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl border pointer-events-none"
          style={{
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
            backdropFilter:'blur(16px)', animation:'lp-badge1 5s ease-in-out infinite',
          }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">HireIndex™ Live</span>
          <span className="text-emerald-400 font-black text-sm">94</span>
        </div>

        {/* top-right */}
        <div className="absolute top-36 right-6 lg:right-16 hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl border pointer-events-none"
          style={{
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
            backdropFilter:'blur(16px)', animation:'lp-badge2 6s ease-in-out infinite',
          }}>
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">AI Coach</span>
          <span className="text-indigo-400 font-black text-xs">Active</span>
        </div>

        {/* bottom-left */}
        <div className="absolute bottom-36 left-6 lg:left-20 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl border pointer-events-none"
          style={{
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
            backdropFilter:'blur(16px)', animation:'lp-badge3 7s ease-in-out infinite',
          }}>
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Performance</span>
          <span className="text-cyan-400 font-black text-sm">+32%</span>
        </div>

        {/* bottom-right */}
        <div className="absolute bottom-36 right-6 lg:right-20 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl border pointer-events-none"
          style={{
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
            backdropFilter:'blur(16px)', animation:'lp-badge1 8s ease-in-out infinite 1s',
          }}>
          <Users className="w-4 h-4 text-violet-400" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Interns</span>
          <span className="text-violet-400 font-black text-sm">500+</span>
        </div>

        {/* ── Hero text content — z above canvas ── */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
            style={{
              background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.35)',
              backdropFilter:'blur(12px)', animation:'lp-fadeUp 0.7s 0ms both',
            }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
            </span>
            <span className="text-indigo-300 text-[11px] font-black uppercase tracking-[0.2em]">
              AI-Powered Internship Intelligence Platform
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-black tracking-tighter leading-[1.05] mb-6"
            style={{ animation:'lp-fadeUp 0.8s 100ms both' }}>

            <span className="block text-3xl sm:text-4xl lg:text-5xl text-slate-200 mb-2 font-bold tracking-tight">
              The Smartest Way to
            </span>

            <span className="block text-5xl sm:text-7xl lg:text-[5.5rem] relative"
              style={gradStyle}>
              Hire Top Interns
              {/* glow halo behind gradient text */}
              <span className="absolute inset-0 pointer-events-none blur-3xl opacity-30"
                style={{ background:'linear-gradient(135deg,#818cf8,#a78bfa,#67e8f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Hire Top Interns
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed max-w-2xl mb-12"
            style={{ animation:'lp-fadeUp 0.8s 200ms both' }}>
            NexoraAI's <span className="text-indigo-400 font-bold">HireIndex™</span> engine analyses performance signals,
            coaches interns with real-time AI, and gives you the data to make
            smarter, faster hiring decisions — all in one platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-14"
            style={{ animation:'lp-fadeUp 0.8s 300ms both' }}>
            <button onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-9 py-4 text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.04] active:scale-[0.98]"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 20px 60px rgba(99,102,241,0.45)' }}>
              Start Free — No Credit Card <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setDemoOpen(true)}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
              style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.18)', color:'white', backdropFilter:'blur(12px)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}>
              <PlayCircle className="w-5 h-5 text-indigo-400" /> Watch Demo
            </button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-6"
            style={{ animation:'lp-fadeUp 0.8s 420ms both' }}>
            {['No setup required','3 roles included','AI coach ready'].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ animation:'lp-fadeIn 1s 1.2s both' }}>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Explore</span>
          <ChevronDown className="w-5 h-5 text-slate-600" style={{ animation:'lp-scroll 2s ease-in-out infinite' }} />
        </div>

        {/* Fade to white at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background:'linear-gradient(to bottom, transparent, white)' }} />
      </section>

      {/* ════════════════ STATS BAR ═════════════════════════ */}
      <section className="py-16 bg-white border-b border-slate-100/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val:500, suf:'+', label:'Interns Analysed',       color:'#4f46e5' },
              { val:98,  suf:'%', label:'Satisfaction Rate',      color:'#10b981' },
              { val:3,   suf:'x', label:'Faster Hiring Decisions', color:'#7c3aed' },
              { val:40,  suf:'%', label:'Better Retention Rate',  color:'#06b6d4' },
            ].map((s,i) => (
              <div key={i} className="text-center group" style={{ animation:`lp-fadeUp 0.6s ${i*80}ms both` }}>
                <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-105 transition-transform" style={{ color:s.color }}>
                  <CountUp target={s.val} suffix={s.suf} />
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Trust logos */}
          <div className="mt-14 flex flex-wrap justify-center items-center gap-12 opacity-20 grayscale">
            {[
              { icon:<Globe className="w-5 h-5" />,    name:'GlobalNet' },
              { icon:<Cpu   className="w-5 h-5" />,    name:'InfoTech'  },
              { icon:<Users className="w-5 h-5" />,    name:'TeamFlow'  },
              { icon:<BarChart3 className="w-5 h-5" />,name:'DataCore'  },
            ].map(b => (
              <div key={b.name} className="flex items-center gap-2">
                {b.icon}
                <span className="text-base font-black tracking-tighter uppercase">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FEATURES ══════════════════════════ */}
      <section id="features" className="py-28 px-6"
        style={{ background:'linear-gradient(180deg,#ffffff 0%,#f7f9ff 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background:'linear-gradient(135deg,#fdf4ff,#eff6ff)', border:'1px solid rgba(139,92,246,0.22)' }}>
              <span className="text-purple-700 text-[10px] font-black uppercase tracking-widest">Core Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-5 tracking-tighter leading-tight">
              Engineered for <br />
              <span style={indStyle}>Excellence</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Every feature purpose-built to elevate intern performance and accelerate smarter hiring decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f,i) => <Feature3DCard key={i} feature={f} delay={i*90} />)}
          </div>
        </div>
      </section>

      {/* ════════════════ HIREINDEX SHOWCASE ════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#020817 0%,#0f0a2e 55%,#020817 100%)' }}>

        <div className="absolute inset-0 opacity-25">
          <NeuralNetworkCanvas nodeCount={40} maxDist={100} />
        </div>
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(135deg,rgba(2,8,23,0.82),rgba(15,10,46,0.82))' }} />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Gauge */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background:'radial-gradient(circle,rgba(99,102,241,0.22) 0%,transparent 70%)', transform:'scale(1.4)', animation:'lp-pulse 5s ease-in-out infinite' }} />

              <div className="relative w-64 h-64 lg:w-72 lg:h-72">
                <svg viewBox="0 0 220 220" className="w-full h-full">
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#4f46e5" />
                      <stop offset="50%"  stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="110" cy="110" r="88" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="14"/>
                  <circle cx="110" cy="110" r="88" fill="none"
                    stroke="url(#gaugeGrad)" strokeWidth="14"
                    strokeDasharray={`${2*Math.PI*88*0.94} ${2*Math.PI*88}`}
                    strokeLinecap="round" transform="rotate(-90 110 110)"
                    style={{ filter:'drop-shadow(0 0 12px rgba(99,102,241,0.9))' }} />
                  <text x="110" y="98"  textAnchor="middle" fill="white"                fontSize="42" fontWeight="900" fontFamily="Inter,-apple-system">94</text>
                  <text x="110" y="120" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="800" fontFamily="Inter,-apple-system" letterSpacing="2">HIREINDEX™</text>
                  <text x="110" y="138" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9"  fontFamily="Inter,-apple-system">HIRE READY</text>
                </svg>

                <div className="absolute -right-10 top-10 rounded-xl p-3 text-center border"
                  style={{ background:'rgba(2,8,23,0.9)', borderColor:'rgba(255,255,255,0.08)', backdropFilter:'blur(12px)', animation:'lp-badge1 5s ease-in-out infinite' }}>
                  <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Conversion</div>
                  <div className="text-emerald-400 font-black text-base">High</div>
                </div>
                <div className="absolute -left-10 bottom-10 rounded-xl p-3 text-center border"
                  style={{ background:'rgba(2,8,23,0.9)', borderColor:'rgba(255,255,255,0.08)', backdropFilter:'blur(12px)', animation:'lp-badge2 6s ease-in-out infinite' }}>
                  <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Gap Score</div>
                  <div className="text-cyan-400 font-black text-base">2.1%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-indigo-500/30"
              style={{ background:'rgba(99,102,241,0.08)' }}>
              <TrendingUp className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Proprietary AI Engine</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter leading-tight">
              Meet <span style={{ background:'linear-gradient(135deg,#818cf8,#a78bfa,#67e8f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>HireIndex™</span><br />
              Your AI Hiring Oracle
            </h2>

            <p className="text-slate-400 text-lg font-medium mb-8 leading-relaxed">
              Our proprietary HireIndex™ engine analyses hundreds of performance signals to predict intern conversion probability with industry-leading accuracy.
            </p>

            <div className="space-y-5">
              {[
                { label:'Engineering Readiness', pct:94, color:'#4f46e5' },
                { label:'Leadership Potential',  pct:78, color:'#7c3aed' },
                { label:'Technical Proficiency', pct:89, color:'#06b6d4' },
              ].map((item,i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm font-bold">{item.label}</span>
                    <span className="text-white font-black text-sm">{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full"
                      style={{
                        width:`${item.pct}%`,
                        background:`linear-gradient(90deg,${item.color},${item.color}88)`,
                        boxShadow:`0 0 12px ${item.color}70`,
                        animation:`lp-barFill 1.5s ${i*0.3}s both`,
                      }} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/register')}
              className="mt-10 px-8 py-4 text-white rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-[1.04]"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 20px 50px rgba(99,102,241,0.35)' }}>
              Unlock HireIndex™ <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ ABOUT ══════════════════════════════ */}
      <section id="about" className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Image */}
          <div className="flex-1 relative">
            <div className="relative group">
              <div className="absolute -inset-6 rounded-[3rem] -z-10"
                style={{ background:'radial-gradient(circle,rgba(99,102,241,0.07),transparent)', filter:'blur(30px)' }} />
              <img src="/images/about_v2.png" alt="Vision"
                className="w-full h-auto rounded-3xl border-4 border-white"
                style={{ boxShadow:'0 40px 90px rgba(0,0,0,0.09)' }} />

              {/* Testimonial */}
              <div className="absolute -bottom-8 -right-4 p-6 rounded-2xl shadow-2xl max-w-xs hidden md:block"
                style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 20px 60px rgba(99,102,241,0.45)' }}>
                <p className="text-sm font-bold italic text-white/90 mb-4">
                  "NexoraAI transformed how we identify top talent. The HireIndex™ is frighteningly accurate."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-xs text-white uppercase tracking-tight">Abhinay Gowda</p>
                    <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">Founder @ Nexora</p>
                  </div>
                </div>
              </div>

              {/* Top badge */}
              <div className="absolute -top-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden md:block"
                style={{ animation:'lp-badge1 6s ease-in-out infinite', boxShadow:'0 16px 40px rgba(0,0,0,0.07)' }}>
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Vision</div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-black text-slate-900">AI for Good</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background:'linear-gradient(135deg,#eef2ff,#f5f3ff)', border:'1px solid rgba(99,102,241,0.22)' }}>
              <span className="text-indigo-700 text-[10px] font-black uppercase tracking-widest">About NexoraAI</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
              Beyond Automation.<br />
              <span style={indStyle}>Intelligent Collaboration.</span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">
              We built NexoraAI to solve one of tech's biggest problems: companies losing great interns because they lack the data to evaluate them properly. Our AI bridges that gap — permanently.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon:<Star  className="text-amber-400 w-5 h-5" />,   bg:'bg-amber-50',  title:'Our Mission', body:"Create the world's most intelligent intern performance platform where AI and human judgement work in harmony." },
                { icon:<Users className="text-indigo-600 w-5 h-5" />,  bg:'bg-indigo-50', title:'Our Community',body:'A network of engineers, mentors, and admins who believe data-driven decisions build better careers.' },
                { icon:<Brain className="text-purple-600 w-5 h-5" />,  bg:'bg-purple-50', title:'Our AI',       body:"Powered by Groq's Llama 3.1, our AI coach delivers real-time, actionable feedback at any scale." },
                { icon:<Globe className="text-emerald-600 w-5 h-5" />, bg:'bg-emerald-50',title:'Our Impact',   body:'Helping organisations worldwide make smarter, fairer, data-backed hiring decisions every single day.' },
              ].map((c,i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.bg} mb-4`}>{c.icon}</div>
                  <h4 className="font-black text-slate-900 mb-1.5 text-sm uppercase tracking-tight">{c.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#f5f3ff 0%,#eef2ff 50%,#f0f9ff 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(99,102,241,0.14),transparent)', filter:'blur(70px)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(139,92,246,0.12),transparent)', filter:'blur(70px)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background:'linear-gradient(135deg,#eef2ff,#f5f3ff)', border:'1px solid rgba(99,102,241,0.22)' }}>
            <Zap className="w-3 h-3 text-indigo-600" />
            <span className="text-indigo-700 text-[10px] font-black uppercase tracking-widest">Start Today — It's Free</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            Ready to Unlock<br />
            <span style={indStyle}>Intern Intelligence?</span>
          </h2>

          <p className="text-xl text-slate-600 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the platform that's redefining how companies discover, develop, and hire exceptional talent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-10 py-5 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.04]"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 25px 70px rgba(99,102,241,0.38)' }}>
              Get Started Free <ArrowRight className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow-lg">
              Sign In Instead
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ═════════════════════════════ */}
      <footer className="py-16 px-6 bg-slate-950 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/nexoralogo.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                Nexora<span className="text-indigo-500">AI</span>
              </span>
            </div>
            <div className="flex gap-10 text-xs font-black text-slate-500 uppercase tracking-widest">
              {['home','features','about'].map(s => (
                <button key={s} onClick={() => goto(s)} className="capitalize hover:text-indigo-500 transition-colors">{s}</button>
              ))}
              <button className="hover:text-indigo-500 transition-colors">Contact</button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 border-t border-slate-800/60">
            <p className="text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase">© 2026 NexoraAI. By Abhinay Gowda.</p>
            <div className="flex gap-6 text-[10px] text-slate-600 font-bold uppercase">
              <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <VideoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default LandingPage;
