import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import HireIndexStatsCard from './HireIndexStatsCard';
import HireIndexRadarChart from './HireIndexRadarChart';
import HireIndexGapAnalysis from './HireIndexGapAnalysis';
import HireIndexAIExplanation from './HireIndexAIExplanation';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import API_URL from '../../api';

const HireIndexContainer = () => {
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);

    const fetchReport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const res = await axios.get(`${API_URL}/hireindex/report`, config);
            setReport(res.data.data);
            setLoading(false);
        } catch (err) {
            // If 404, it means it hasn't been analyzed yet
            if (err.response?.status === 404) {
                setReport(null);
            } else {
                setError("Failed to load HireIndex report.");
            }
            setLoading(false);
        }
    };

    const runAnalysis = async () => {
        setAnalyzing(true);
        setError(null);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const res = await axios.post(`${API_URL}/hireindex/analyze`, {}, config);
            setReport(res.data.data);
            setAnalyzing(false);
        } catch (err) {
            console.error("Analysis Error:", err);
            const msg = err.response?.data?.message || err.message || "Analysis failed.";
            setError(msg);
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [user.token]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing HireIndex Engine...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="card glass-card p-12 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-10 h-10 text-indigo-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Analyze Your Readiness</h2>
                    <p className="text-slate-500 mt-2 max-w-sm">
                        Nexora HireIndex™ matches your performance against industry full-time benchmarks to predict conversion readiness.
                    </p>
                </div>
                <button
                    onClick={runAnalysis}
                    disabled={analyzing}
                    className="btn btn-primary px-10 py-4 text-lg rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50"
                >
                    {analyzing ? (
                        <span className="flex items-center">
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Calculating...
                        </span>
                    ) : 'Initialize Evaluation'}
                </button>
                {error && <p className="text-rose-500 text-sm font-bold">{error}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center">
                        <ShieldCheck className="w-6 h-6 mr-2 text-indigo-500" />
                        Nexora HireIndex™ Report
                    </h2>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                        LAST EVALUATED: {new Date(report.lastAnalyzed || report.lastEvaluatedAt).toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={runAnalysis}
                    disabled={analyzing}
                    className="flex items-center text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                    {analyzing ? 'Re-analyzing...' : 'Trigger Re-evaluation'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-shake">
                    ⚠️ {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <HireIndexStatsCard
                        score={report.score}
                        status={report.status}
                        trend={report.trend}
                    />
                    <HireIndexAIExplanation explanation={report.aiExplanation} />
                    <HireIndexGapAnalysis gaps={report.gapAnalysis} />
                </div>

                <div>
                    <HireIndexRadarChart metrics={report.metrics} />
                </div>
            </div>
        </div>
    );
};

export default HireIndexContainer;
