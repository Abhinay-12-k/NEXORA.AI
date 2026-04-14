import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

const HireIndexRadarChart = ({ metrics }) => {
    // Transform metrics for Recharts
    const data = [
        { subject: 'Completion', A: metrics.taskCompletionStatus, fullMark: 100 },
        { subject: 'Deadlines', A: metrics.deadlineConsistency, fullMark: 100 },
        { subject: 'Mentor', A: metrics.mentorRatingPercent, fullMark: 100 },
        { subject: 'Code Quality', A: metrics.codeQualityScore, fullMark: 100 },
        { subject: 'GitHub', A: metrics.githubActivity, fullMark: 100 },
        { subject: 'Comm.', A: metrics.communicationScore, fullMark: 100 },
    ];

    return (
        <div className="relative group h-full">
            {/* Animated Glow Backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

            <div className="relative card glass-card border-indigo-200/60 bg-gradient-to-br from-indigo-50/95 via-white/80 to-purple-50/95 p-6 h-full flex flex-col shadow-xl shadow-indigo-500/10">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center">
                    <span className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></span>
                    Performance Fingerprint
                </h3>

                <div className="flex-grow min-h-[300px] w-full group-hover:scale-[1.02] transition-transform duration-500">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#475569', fontSize: 10, fontWeight: 900, textAnchor: 'middle' }}
                            />
                            <Radar
                                name="Capability"
                                dataKey="A"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fill="url(#lavenderGradient)"
                                fillOpacity={0.7}
                            />
                            <defs>
                                <linearGradient id="lavenderGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 20px 25px -5px rgb(99 102 241 / 0.15)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-center space-x-4 mt-auto">
                    <div className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                        Nexora Target Engine
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HireIndexRadarChart;
