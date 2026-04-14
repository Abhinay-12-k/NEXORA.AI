import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Briefcase, ArrowRight, ShieldCheck, Zap, Rocket, TrendingUp, Award } from 'lucide-react';
import CareerCanvas from '../components/CareerCanvas';

/* ── Milestone chip shown in panel ─────────────────────── */
const MilestoneChip = ({ label, sublabel, color, delay = 0, icon }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm"
    style={{
      background: 'rgba(255,255,255,0.06)',
      borderColor: `${color}30`,
      animation: `regFadeLeft 0.6s ${delay}ms both`,
    }}
  >
    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}25`, border: `1px solid ${color}50` }}>
      <span className="text-sm">{icon}</span>
    </div>
    <div>
      <div className="text-white text-xs font-black uppercase tracking-tight">{label}</div>
      <div className="text-slate-400 text-[10px] font-medium">{sublabel}</div>
    </div>
    <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'intern' });
  const [error, setError] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const { name, email, password, role } = formData;

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(name, email, password, role);
    if (!result.success) setError(result.message);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">

      <style>{`
        @keyframes regFadeLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes regFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes regRocketLift {
          0%,100% { transform: translateY(0) rotate(-5deg); }
          50%      { transform: translateY(-18px) rotate(-8deg); }
        }
        @keyframes regGlowPulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.1); }
        }
        @keyframes regScanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 0.3; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(500%); opacity: 0; }
        }
        @keyframes regFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>

      {/* ── Left Panel: Career Trajectory Animation ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16"
        style={{ background: 'linear-gradient(145deg,#020817 0%,#0a0d2e 55%,#020817 100%)' }}>

        {/* Career canvas (dark background — 3D animation area) */}
        <CareerCanvas />

        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/25 to-transparent"
            style={{ animation: 'regScanline 10s linear infinite' }} />
        </div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,13,46,0.4) 0%, rgba(2,8,23,0.7) 100%)' }} />

        {/* Rocket icon centered-ish */}
        <div className="absolute top-1/3 right-12 pointer-events-none">
          <div className="relative" style={{ animation: 'regRocketLift 4s ease-in-out infinite' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 0 40px rgba(99,102,241,0.6), 0 0 0 2px rgba(99,102,241,0.3)',
              }}>
              <Rocket className="w-6 h-6 text-white" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            {/* Glow pulse */}
            <div className="absolute inset-0 rounded-2xl"
              style={{ background: 'rgba(99,102,241,0.3)', animation: 'regGlowPulse 2s ease-in-out infinite', filter: 'blur(8px)' }} />
          </div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top: Logo + milestones */}
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

            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4 tracking-tighter uppercase"
              style={{ animation: 'regFadeLeft 0.7s 100ms both' }}>
              Join the<br />
              <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Future of Work
              </span><br />
              Today.
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-sm mb-8" style={{ animation: 'regFadeLeft 0.7s 200ms both' }}>
              Track your journey from intern to full-time hire with AI-powered insights and personalised coaching.
            </p>

            {/* Career milestones */}
            <div className="space-y-3">
              <MilestoneChip label="Onboard" sublabel="Start your journey" color="#6366f1" delay={300} icon="🚀" />
              <MilestoneChip label="Perform" sublabel="Get AI-powered coaching" color="#8b5cf6" delay={400} icon="⚡" />
              <MilestoneChip label="Excel" sublabel="Hit HireIndex™ targets" color="#06b6d4" delay={500} icon="🎯" />
              <MilestoneChip label="Hired" sublabel="Convert to full-time" color="#10b981" delay={600} icon="✓" />
            </div>
          </div>

          {/* Bottom: trust badges */}
          <div className="flex flex-wrap gap-6" style={{ animation: 'regFadeLeft 0.7s 700ms both' }}>
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, label: 'Secure' },
              { icon: <TrendingUp className="w-4 h-4 text-indigo-400" />, label: 'AI-Scored' },
              { icon: <Award className="w-4 h-4 text-amber-400" />, label: 'Hire-Ready' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-white text-[10px] font-black tracking-widest uppercase">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Register Form ───────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="max-w-md w-full" style={{ animation: 'regFadeUp 0.6s 0ms both' }}>

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

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Create Account</h1>
          <p className="text-slate-500 font-medium mb-8 text-sm">Join the intelligence platform and scale your impact.</p>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-3 border border-red-100"
              style={{ animation: 'regFadeUp 0.3s ease' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input id="name" name="name" type="text" required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                  placeholder="John Doe" value={name} onChange={onChange} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input id="email" name="email" type="email" required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                  placeholder="name@company.com" value={email} onChange={onChange} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input id="password" name="password" type="password" required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                  placeholder="••••••••" value={password} onChange={onChange} />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Your Role</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <select id="role" name="role"
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium appearance-none cursor-pointer"
                  value={role} onChange={onChange}>
                  <option value="intern">Intern</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit"
                className="w-full flex justify-center items-center py-4 text-white rounded-xl font-black text-base transition-all active:scale-[0.98] group uppercase tracking-widest"
                style={{ background: 'linear-gradient(135deg,#1e293b,#334155)', boxShadow: '0 8px 24px rgba(30,41,59,0.18)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#4f46e5,#7c3aed)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#1e293b,#334155)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,41,59,0.18)'; }}
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 text-center uppercase tracking-tighter">
            <p className="text-slate-400 text-xs font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4">
                Sign in instead
              </Link>
            </p>
          </div>

          <p className="mt-10 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
            © 2026 NexoraAI. By Abhinay Gowda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
