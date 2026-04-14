import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Award, ChevronRight, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import API_URL from '../../api';

const HireIndexLeaderboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const res = await axios.get(`${API_URL}/hireindex/stats`, config);
                setStats(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching HireIndex stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    if (loading) return <div className="card animate-pulse h-64 bg-slate-50"></div>;
    if (!stats || !stats.topPerformers.length) return null;

    return (
        <div className="card glass-indigo p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" />
                    HireIndex™ Top 5
                </h2>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Conversion Ready
                </span>
            </div>

            <div className="space-y-4">
                {stats.topPerformers.map((intern, index) => (
                    <div key={intern._id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white hover:border-indigo-200 transition-all group">
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-600' :
                                    index === 1 ? 'bg-slate-100 text-slate-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-600' :
                                            'bg-indigo-50 text-indigo-400'
                                }`}>
                                {index + 1}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {intern.user?.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                    {intern.hireIndexStatus}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-800">{intern.hireIndexScore}%</p>
                            <div className={`flex items-center justify-end text-[10px] font-bold ${intern.hireIndexTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {intern.hireIndexTrend >= 0 ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                                {Math.abs(intern.hireIndexTrend).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-3 text-xs font-black text-indigo-500 uppercase tracking-widest border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center group">
                View Talent Pipeline
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default HireIndexLeaderboard;
