import React from 'react';
import { AlertCircle, ArrowRightCircle } from 'lucide-react';

const HireIndexGapAnalysis = ({ gaps }) => {
    if (!gaps || gaps.length === 0) {
        return (
            <div className="card glass-card p-6 bg-emerald-50/30 border-emerald-100">
                <p className="text-emerald-700 font-bold flex items-center">
                    <span className="mr-2">✨</span>
                    Perfect Alignment! No performance gaps identified.
                </p>
            </div>
        );
    }

    return (
        <div className="relative group">
            {/* Animated Glow Backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative card glass-card border-amber-200/50 bg-gradient-to-br from-amber-50/80 via-white/40 to-white/80 p-6 shadow-xl shadow-amber-500/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                        <AlertCircle className="w-5 h-5 mr-3 text-amber-500" />
                        Gap Analysis & Optimization
                    </h3>
                    <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-200"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    {gaps.map((gap, index) => (
                        <div
                            key={index}
                            className="flex items-start p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 hover:border-indigo-200 transition-all group/item shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-white flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform">
                                <span className="text-lg">🎯</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">
                                    {gap.metric}
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed font-bold">
                                    {gap.suggestion}
                                </p>
                            </div>
                            <ArrowRightCircle className="w-5 h-5 text-slate-300 group-hover/item:text-indigo-400 transition-colors ml-2 self-center" />
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">
                        Critical Development Path Identified
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HireIndexGapAnalysis;
