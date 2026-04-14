import React, { useState } from 'react';
import axios from 'axios';
import {
    Zap,
    Target,
    Calendar,
    ShieldCheck,
    Loader2,
    Sparkles,
    MessageSquare,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api';

const AICoachPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleAction = async (type) => {
        setLoading(true);
        setActionType(type);
        setError(null);
        setResponse(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.post(`${API_URL}/ai-coach/evaluate`, { actionType: type }, config);
            setResponse(res.data.data);
        } catch (err) {
            console.error('AI Coach Error:', err);
            setError(err.response?.data?.message || 'Failed to connect to AI Coach. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const actions = [
        {
            id: 'analyze',
            label: 'Analyze My Performance',
            description: 'Get a detailed breakdown of your metrics and their impact.',
            icon: Target,
            color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
            borderColor: 'border-indigo-100',
            textColor: 'text-indigo-600'
        },
        {
            id: 'plan',
            label: 'Generate 7-Day Action Plan',
            description: 'Receive measurable and practical steps to improve this week.',
            icon: Calendar,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            borderColor: 'border-purple-100',
            textColor: 'text-purple-600'
        },
        {
            id: 'readiness',
            label: 'Full-Time Readiness Advice',
            description: 'Check your current readiness and top priority areas.',
            icon: ShieldCheck,
            color: 'bg-gradient-to-br from-violet-500 to-violet-600',
            borderColor: 'border-violet-100',
            textColor: 'text-violet-600'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <header className="page-header flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        <span>Powered by Nexora Intelligence</span>
                    </div>
                    <h1 className="page-title">
                        Personal <span className="text-indigo-600">AI Coach</span>
                    </h1>
                    <p className="page-subtitle">
                        Your personalized performance analysis and career readiness accelerator. Data-driven advice, tailored to your metrics.
                    </p>
                </div>
                <div className="shrink-0 relative z-10">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl rotate-12 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                        <Zap className="w-16 h-16 text-white -rotate-12" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        disabled={loading}
                        className={`group relative card text-left transition-all duration-300 hover:border-indigo-200 disabled:opacity-70 disabled:hover:translate-y-0`}
                    >
                        <div className={`w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-105 transition-transform`}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{action.label}</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{action.description}</p>
                        <div className={`absolute bottom-6 right-6 flex items-center ${action.textColor} font-bold text-sm`}>
                            <span>Get Started</span>
                            <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>

            {(loading || response || error) && (
                <div className="relative group animate-slideUp mt-8">
                    <div className="card min-h-[400px] flex flex-col relative overflow-hidden">
                        <div className="relative z-10 flex items-center space-x-4 mb-10">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <MessageSquare className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                    Coach Insights
                                </h2>
                                {actionType && (
                                    <p className="text-sm font-bold text-purple-600/70 uppercase tracking-widest mt-0.5">
                                        {actions.find(a => a.id === actionType)?.label}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                            {loading ? (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-purple-100 rounded-full mx-auto" />
                                        <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                                    </div>
                                    <p className="text-slate-500 font-black animate-pulse uppercase tracking-[0.4em] text-[10px]">AI is generating your plan...</p>
                                </div>
                            ) : error ? (
                                <div className="space-y-6 max-w-md bg-white p-8 rounded-2xl border border-red-100 shadow-sm mx-auto">
                                    <div className="p-4 bg-red-50 rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-black text-slate-800">Connection Interrupted</h3>
                                        <p className="text-slate-500 leading-relaxed font-bold italic">"{error}"</p>
                                    </div>
                                    <button
                                        onClick={() => handleAction(actionType)}
                                        className="btn btn-primary w-full"
                                    >
                                        RETRY ANALYSIS
                                    </button>
                                </div>
                            ) : response ? (
                                <div className="w-full text-left space-y-6 animate-fadeIn">
                                    <div className="bg-indigo-50/50 rounded-2xl p-8 border border-white relative transition-all">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-full" />

                                        <div className="relative z-10 text-slate-700 font-medium text-base leading-relaxed whitespace-pre-line">
                                            {response}
                                        </div>
                                        <Sparkles className="absolute bottom-6 right-6 text-indigo-200/40 w-24 h-24 pointer-events-none opacity-50" />
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                                        <p className="text-xs text-slate-400 font-semibold italic">
                                            Premium recommendations calculated via Nexora Performance Intelligence.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 max-w-sm mx-auto">
                                    <div className="p-5 bg-indigo-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                                    </div>
                                    <p className="text-slate-500 font-bold leading-relaxed text-sm">
                                        Select a coaching target above to reveal your personalized performance strategy.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AICoachPage;
