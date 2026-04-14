import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, Sparkles, Cpu, ShieldCheck, Zap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* Left Side: Illustration & Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-16">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-0"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-0"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1.5">
                            <img src="/nexoralogo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase">Nexora<span className="text-indigo-500">AI</span></span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-6 mt-16 tracking-tighter uppercase">
                        Empowering the <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-400">Next Generation</span> <br/>
                        of Intelligence.
                    </h2>
                    <p className="text-slate-400 text-base font-medium max-w-sm">
                        Join the world's most advanced performance intelligence platform and unlock your team's true potential.
                    </p>
                </div>

                <div className="relative z-10">
                    <img 
                        src="/images/auth_v3.png" 
                        alt="AI Intelligence" 
                        className="w-full max-w-[280px] mx-auto animate-bounce-slow drop-shadow-[0_0_50px_rgba(37,99,235,0.2)]"
                    />
                </div>

                <div className="relative z-10 flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 text-white text-[10px] font-black tracking-widest uppercase">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure
                    </div>
                    <div className="flex items-center gap-2 text-white text-[10px] font-black tracking-widest uppercase">
                        <Zap className="w-4 h-4 text-amber-400" /> Fast
                    </div>
                </div>

                <style>{`
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 6s ease-in-out infinite;
                    }
                `}</style>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50 lg:bg-white">
                <div className="max-w-md w-full animate-fadeIn">
                    <div className="mb-8 lg:hidden">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center p-1">
                                <img src="/nexoralogo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">Nexora<span className="text-indigo-600">AI</span></span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Welcome Back</h1>
                    <p className="text-slate-500 font-medium mb-8 text-sm">Please enter your details to access your account.</p>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-3 border border-red-100 animate-fadeIn">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
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
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between ml-1">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-bold">Remember me</label>
                            </div>
                            <div className="text-xs">
                                <a href="#" className="font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-4 bg-slate-900 text-white rounded-xl font-black text-base hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/20 transition-all active:scale-[0.98] group uppercase tracking-widest"
                        >
                            Sign in
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

                    <div className="mt-12 flex items-center gap-4 text-slate-200">
                        <div className="h-px flex-1 bg-slate-100"></div>
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-300">Auth Portal</span>
                        <div className="h-px flex-1 bg-slate-100"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
