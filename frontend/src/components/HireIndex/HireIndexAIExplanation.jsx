import React from 'react';
import { Sparkles } from 'lucide-react';

const HireIndexAIExplanation = ({ explanation }) => {
    return (
        <div className="relative group">
            {/* Animated Glow Backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative card glass-card p-6 bg-gradient-to-br from-blue-50/90 via-white/50 to-indigo-50/90 border-blue-100/50 shadow-xl shadow-blue-500/5">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                        AI Readiness Narrative
                    </h3>
                </div>

                <p className="text-slate-600 leading-relaxed italic font-medium">
                    "{explanation}"
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Powered by Nexora Intelligence Engine™
                    </span>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center">
                                <span className="text-[10px]">🤖</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HireIndexAIExplanation;
