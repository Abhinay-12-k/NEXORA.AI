import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, ShieldCheck, Zap, Brain, Activity } from 'lucide-react';
import NeuralNetworkCanvas from '../components/NeuralNetworkCanvas';

/* ── Animated status indicator ─────────────────────────── */
const StatusLine = ({ label, delay = 0, color = '#6366f1' }) => (
  <div className="flex items-center gap-3" style={{ animation: `loginFadeLeft 0.6s ${delay}ms both` }}>
    <div className="relative">
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
      <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-50" style={{ background: color }} />
    </div>
    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) setError(result.message);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">

      <style>{`
        @keyframes loginFadeLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loginScanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 0.4; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        @keyframes loginOrbit {
          from { transform: rotate(0deg) translateX(70px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(70px) rotate(-360deg); }
        }
        @keyframes loginOrbit2 {
          from { transform: rotate(120deg) translateX(100px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(100px) rotate(-480deg); }
        }
        @keyframes loginOrbit3 {
          from { transform: rotate(240deg) translateX(55px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(55px) rotate(-600deg); }
        }
        @keyframes loginPulseRing {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      {/* ── Left Panel: Neural Network Visualization ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16"
        style={{ background: 'linear-gradient(145deg,#020817 0%,#0d0a2e 55%,#020817 100%)' }}>

        {/* Neural network canvas (dark background — 3D animation area) */}
        <NeuralNetworkCanvas nodeCount={65} maxDist={110} />

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"
            style={{ animation: 'loginScanline 8s linear infinite' }} />
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(15,10,46,0.5) 0%, rgba(2,8,23,0.75) 100%)' }} />

        {/* Orbiting AI nodes (pure CSS 3D) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 200, height: 200 }}>
          {/* Center orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 0 30px rgba(99,102,241,0.8)' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            {/* Pulse rings */}
            {[1, 2, 3].map(i => (
              <div key={i} className="absolute inset-0 rounded-full border border-indigo-400/30"
                style={{ animation: `loginPulseRing 2.5s ${i * 0.8}s ease-out infinite` }} />
            ))}
          </div>

          {/* Orbiting nodes */}
          {[
            { anim: 'loginOrbit 8s linear infinite', icon: <Activity className="w-2.5 h-2.5 text-white" />, color: '#6366f1' },
            { anim: 'loginOrbit2 13s linear infinite', icon: <ShieldCheck className="w-2.5 h-2.5 text-white" />, color: '#10b981' },
            { anim: 'loginOrbit3 6s linear infinite', icon: <Zap className="w-2.5 h-2.5 text-white" />, color: '#f59e0b' },
          ].map((orb, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ animation: orb.anim }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: orb.color, boxShadow: `0 0 16px ${orb.color}aa` }}>
                {orb.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top: Logo + Status */}
          <div>
            <div className="flex items-center gap-3 mb-14">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1.5"
                style={{ boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}>
                <img src="/nexoralogo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                Nexora<span className="text-indigo-400">AI</span>
              </span>
            </div>

            {/* Status indicators */}
            <div className="space-y-3 mb-10">
              <StatusLine label="Neural Analysis Engine" delay={100} color="#6366f1" />
              <StatusLine label="HireIndex™ Active" delay={220} color="#10b981" />
              <StatusLine label="AI Coach Ready" delay={340} color="#06b6d4" />
              <StatusLine label="Secure Data Vault" delay={460} color="#f59e0b" />
            </div>

            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4 tracking-tighter uppercase"
              style={{ animation: 'loginFadeLeft 0.7s 600ms both' }}>
              Empowering the<br />
              <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Next Generation
              </span><br />
              of Intelligence.
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-sm" style={{ animation: 'loginFadeLeft 0.7s 700ms both' }}>
              Access the world's most advanced internship performance intelligence platform.
            </p>
          </div>

          {/* Bottom: Trust badges */}
          <div className="flex flex-wrap gap-6" style={{ animation: 'loginFadeLeft 0.7s 800ms both' }}>
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, label: 'Secure' },
              { icon: <Zap className="w-4 h-4 text-amber-400" />, label: 'Real-time' },
              { icon: <Brain className="w-4 h-4 text-indigo-400" />, label: 'AI-Powered' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-white text-[10px] font-black tracking-widest uppercase">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ──────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="max-w-md w-full" style={{ animation: 'loginFadeUp 0.6s 0ms both' }}>

          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center p-1">
                <img src="/nexoralogo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
                Nexora<span className="text-indigo-600">AI</span>
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Welcome Back</h1>
          <p className="text-slate-500 font-medium mb-8 text-sm">Enter your details to access your account.</p>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-3 border border-red-100"
              style={{ animation: 'loginFadeUp 0.3s ease' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="email-address" name="email" type="email" required
                  className="block w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="password" name="password" type="password" required
                  className="block w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between ml-1">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-bold">Remember me</label>
              </div>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
            </div>

            <button type="submit"
              className="w-full flex justify-center items-center py-4 text-white rounded-xl font-black text-base transition-all active:scale-[0.98] group uppercase tracking-widest"
              style={{ background: 'linear-gradient(135deg,#1e293b,#334155)', boxShadow: '0 8px 24px rgba(30,41,59,0.18)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#4f46e5,#7c3aed)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#1e293b,#334155)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,41,59,0.18)'; }}
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center uppercase tracking-tighter">
            <p className="text-slate-400 text-xs font-bold">
              New to NexoraAI?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-300">Auth Portal</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
