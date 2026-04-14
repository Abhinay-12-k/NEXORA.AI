import React from 'react';
import { Award, TrendingUp, TrendingDown, Target } from 'lucide-react';

const HireIndexStatsCard = ({ score, status, trend }) => {
    const isPositive = trend >= 0;

    return (
        <div className="relative group">
            {/* Animated Glow Backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative card glass-card border-indigo-200/50 bg-gradient-to-br from-indigo-50/80 via-white/40 to-white/80 p-6 overflow-hidden shadow-xl shadow-indigo-500/5">
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center mb-2">
                                <Target className="w-3.5 h-3.5 mr-1.5" />
                                Nexora HireIndex™
                            </p>
                            <div className="flex items-end space-x-2">
                                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
                                    {score}%
                                </h2>
                                <div className={`flex items-center mb-1 text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {isPositive ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
                                    {Math.abs(trend).toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block ${score >= 85 ? 'bg-emerald-500 text-white' :
                                score >= 70 ? 'bg-indigo-500 text-white' :
                                    score >= 50 ? 'bg-amber-500 text-white' :
                                        'bg-rose-500 text-white'
                                }`}>
                                {status}
                            </span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                Target Threshold: <span className="text-indigo-600 uppercase">85%</span>
                            </p>
                        </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-24 h-24 group-hover:scale-105 transition-transform duration-500">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48" cy="48" r="40"
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent" className="text-slate-100/50"
                            />
                            <circle
                                cx="48" cy="48" r="40"
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 40}
                                strokeDashoffset={2 * Math.PI * 40 * (1 - score / 100)}
                                strokeLinecap="round"
                                className={`transition-all duration-1000 ease-out fill-none ${score >= 85 ? 'text-emerald-500' :
                                    score >= 70 ? 'text-indigo-500' :
                                        'text-amber-500'
                                    }`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Award className={`w-8 h-8 ${score >= 85 ? 'text-emerald-500' :
                                score >= 70 ? 'text-indigo-500' :
                                    'text-slate-300'
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Animated Background Accents */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
            </div>
        </div>
    );
};

export default HireIndexStatsCard;
