import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BookOpen,
    Target,
    ExternalLink,
    TrendingDown,
    Briefcase,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api';

const statusConfig = {
    Strong: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
    Moderate: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
    Weak: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
};

const LearningHubPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const res = await axios.get(`${API_URL}/learning-hub`, config);
                setData(res.data);
            } catch (err) {
                console.error('Learning Hub Error:', err);
                setError(err.response?.data?.message || 'Failed to load learning data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        if (error.includes('HireIndex data not available')) {
            return (
                <div className="max-w-2xl mx-auto mt-12 text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-10 h-10 text-orange-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Awaiting HireIndex™ Analysis</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        Your personalized Learning Hub is generated from your performance metrics. Run your first HireIndex™ analysis to unlock your growth pathway.
                    </p>
                    <button
                        onClick={() => window.location.href = '/hireindex'}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Go to HireIndex™
                    </button>
                </div>
            );
        }
        return (
            <div className="max-w-2xl mx-auto mt-12">
                <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    const { currentScore, threshold, weakestMetrics = [], recommendations = [], companySkills = [], mandatoryEcosystem = [] } = data || {};

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* ── Header ── */}
            <header>
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Learning Hub</h1>
                </div>
                <p className="text-slate-500 text-sm ml-[52px]">
                    Personalised growth pathways powered by your Nexora HireIndex™ metrics.
                </p>
            </header>

            {/* ── Score Summary Bar ── */}
            <div className="relative bg-gradient-to-r from-[#fff4e6] to-[#ffe8cc] rounded-xl px-5 py-4 border border-orange-200/40 overflow-hidden shadow-sm">
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your HireIndex™</span>
                            <span className="text-3xl font-black text-slate-800">
                                {currentScore}%
                            </span>
                        </div>
                        <div className="h-10 w-px bg-orange-200/60"></div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</span>
                            <span className="text-3xl font-black text-emerald-600">
                                {threshold}%
                            </span>
                        </div>
                    </div>
                    {weakestMetrics.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 border border-orange-200/50 rounded-full">
                            <TrendingDown className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-semibold text-orange-700">
                                {weakestMetrics.length} weak {weakestMetrics.length === 1 ? 'metric' : 'metrics'} identified
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Weakest Metrics Highlight ── */}
            {weakestMetrics.length > 0 && (
                <section>
                    <div className="flex flex-col mb-8">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                            <Target className="w-6 h-6 text-orange-500" />
                            Performance Gaps
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 ml-9">Key areas requiring immediate improvement to reach target readiness.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weakestMetrics.map((m, i) => (
                            <div
                                key={i}
                                className="card group overflow-hidden border-t-4 border-t-orange-400"
                            >

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em]">Metric</p>
                                        <div className="w-8 h-1 bg-orange-200 rounded-full group-hover:w-12 transition-all duration-500"></div>
                                    </div>

                                    <h3 className="text-sm font-extrabold text-slate-800 mb-4">{m.label}</h3>

                                    <div className="flex items-end gap-1.5 mb-4">
                                        <span className="text-4xl font-black text-orange-500 tracking-tighter transition-transform group-hover:scale-110 origin-left duration-500">
                                            {m.score}
                                        </span>
                                        <span className="text-xs font-bold text-slate-300 mb-1.5 uppercase letter-spacing-widest">%</span>
                                    </div>

                                    {/* Glassy Progress Track */}
                                    <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden border border-orange-100/30">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-400 to-amber-300 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(251,146,60,0.3)]"
                                            style={{ width: `${m.score}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight text-right">
                                        Target: 80%+
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Personalised Recommendations ── */}
            {recommendations.length > 0 && (
                <section>
                    <div className="flex flex-col mb-8">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-indigo-500" />
                            Personalised Recommendations
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 ml-9">High-impact focus areas based on your recent analytics.</p>
                    </div>

                    <div className="space-y-8">
                        {recommendations.map((rec, i) => (
                            <div
                                key={i}
                                className="card group overflow-hidden border-t-4 border-t-indigo-500"
                            >

                                {/* Header with Accent */}
                                <div className="flex items-center justify-between flex-wrap gap-4 mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]"></div>
                                        <div>
                                            <p className="text-lg font-black text-slate-800">
                                                Improve: {rec.metric}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                                <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
                                                    Current Score: {rec.score}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-white/60 text-indigo-600 text-[10px] font-black uppercase tracking-[0.15em] rounded-full border border-indigo-100/50 backdrop-blur-sm">
                                        Actionable Focus
                                    </span>
                                </div>

                                {/* Focus Areas Tags */}
                                <div className="flex flex-wrap gap-2.5 mb-8 relative z-10">
                                    {rec.focusAreas.map((area, j) => (
                                        <span
                                            key={j}
                                            className="px-4 py-1.5 bg-white/90 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 shadow-sm transition-all hover:bg-white hover:border-indigo-300"
                                        >
                                            {area}
                                        </span>
                                    ))}
                                </div>

                                {/* Resources Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                    {rec.resources.map((res, k) => (
                                        <a
                                            key={k}
                                            href={res.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 bg-white/70 hover:bg-white border border-white rounded-[22px] transition-all duration-300 shadow-sm hover:shadow-lg group/item"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center p-2.5 shrink-0 border border-indigo-50 group-hover/item:scale-105 transition-transform">
                                                <img
                                                    src={res.logo}
                                                    alt={res.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <p className="text-[13px] font-extrabold text-slate-700 group-hover/item:text-indigo-600 truncate transition-colors">
                                                        {res.name}
                                                    </p>
                                                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-indigo-400 opacity-0 group-hover/item:opacity-100 transition-all" />
                                                </div>
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                                                    {res.category}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Mandatory Learning Ecosystem ── */}
            <section className="pt-12 border-t border-slate-100/50">
                <div className="flex flex-col mb-10 text-center">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-full border border-emerald-100 w-fit mx-auto mb-3">
                        Curated Ecosystem
                    </span>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-3">
                        <Sparkles className="w-7 h-7 text-emerald-500 animate-pulse" />
                        Mandatory Learning Ecosystem
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto italic">
                        The essential professional toolstack for world-class engineering teams.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mandatoryEcosystem.map((section, idx) => (
                        <div
                            key={idx}
                            className="card group flex flex-col overflow-hidden border-t-4 border-t-emerald-400"
                        >

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-2 h-8 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.5)]"></div>
                                <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest leading-tight">
                                    {section.category}
                                </h3>
                            </div>

                            {/* Resource Cards */}
                            <div className="space-y-4 flex-1 relative z-10">
                                {section.resources.map((res, rIdx) => (
                                    <a
                                        key={rIdx}
                                        href={res.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-white/80 border border-white rounded-[20px] shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 group/item"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center p-2.5 shrink-0 border border-slate-100 group-hover/item:scale-110 transition-transform">
                                            <img
                                                src={res.logo}
                                                alt={res.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <p className="text-sm font-extrabold text-slate-800 group-hover/item:text-emerald-600 transition-colors truncate">
                                                    {res.name}
                                                </p>
                                                <ExternalLink className="w-3 h-3 text-slate-300 group-hover/item:text-emerald-400 opacity-0 group-hover/item:opacity-100 transition-all" />
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-tight font-medium line-clamp-2">
                                                {res.desc}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Company Skill Alignment ── */}
            <section className="pt-16 border-t border-slate-100">
                <div className="flex flex-col mb-10 text-center">
                    <span className="px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-full border border-sky-100 w-fit mx-auto mb-3">
                        Skill Synchronization
                    </span>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-3">
                        <Briefcase className="w-7 h-7 text-sky-500" />
                        Company Skill Alignment
                    </h2>
                    <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto">
                        Real-time alignment with Nexora hiring standards and role expectations.
                        Baseline readiness: <span className="font-bold text-sky-600">{threshold}%</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {companySkills.map((cs, i) => {
                        const cfg = statusConfig[cs.currentStatus] || statusConfig.Weak;
                        const StatusIcon = cfg.icon;
                        return (
                            <div
                                key={i}
                                className="card group flex flex-col justify-between h-full overflow-hidden border-t-4 border-t-sky-400"
                            >

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-[13px] font-black text-slate-800 group-hover:text-sky-700 transition-colors leading-tight pr-4">
                                            {cs.skill}
                                        </p>
                                        <div className={`p-1.5 rounded-xl ${cfg.bg} ${cfg.color} border ${cfg.border} transition-all group-hover:rotate-12 group-hover:scale-110 shadow-sm`}>
                                            <StatusIcon className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                            <span className={`text-[11px] font-black ${cfg.color} px-2 py-0.5 rounded-lg ${cfg.bg} border ${cfg.border}`}>
                                                {cs.currentStatus}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match</span>
                                            <p className="text-lg font-black text-slate-700 tracking-tighter">{cs.averageScore}%</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-sky-200/40 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-sky-500 uppercase tracking-tighter">Goal Level</span>
                                        <span className="text-[9px] font-black text-slate-500 uppercase px-2 py-0.5 bg-white shadow-sm rounded-lg border border-sky-100">
                                            {cs.requiredLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── No Weak Metrics State ── */}
            {weakestMetrics.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6 border border-emerald-100">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">Peak Performance Detected</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto px-4">
                        All your HireIndex™ metrics are above the 80% baseline. You're currently performing at a world-class standard.
                    </p>
                </div>
            )}
        </div>
    );
};

export default LearningHubPage;
