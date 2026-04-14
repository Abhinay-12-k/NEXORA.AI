import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../api';
import {
    BarChart3,
    Users,
    CheckCircle,
    TrendingUp,
    AlertTriangle,
    ShieldAlert,
    Loader2,
    AlertCircle,
    Target,
    Activity
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';

// ─── Colors ───────────────────────────────────────────────────────────────────
const COLORS = {
    ready: '#10b981',
    onTrack: '#3b82f6',
    needsImprovement: '#f59e0b',
    highRisk: '#ef4444',
    accent: '#FF8A3D' // Pleasant Bright Orange
};

const PIE_COLORS = [COLORS.ready, COLORS.onTrack, COLORS.needsImprovement, COLORS.highRisk];

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, icon: Icon, color, subtitle }) => (
    <div className="stat-card">
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-indigo-50 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="w-5 h-5 text-indigo-600" />
                </div>
            </div>
            <div>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{value}</p>
                <p className="text-sm font-bold text-slate-500 mt-1 tracking-wider">{label}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
            </div>
        </div>
    </div>
);

// ─── Metric Bar ───────────────────────────────────────────────────────────────
const MetricBar = ({ label, value, maxVal = 100 }) => {
    const percent = Math.min(100, Math.max(0, (value / maxVal) * 100));

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <div className="px-2 py-0.5 bg-indigo-50 rounded-lg border border-indigo-100">
                    <span className="text-xs font-black text-indigo-600 tabular-nums">{value}%</span>
                </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
            <p className="font-bold mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-slate-300">
                    {p.name}: <span className="font-bold text-white">{p.value}</span>
                </p>
            ))}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const HiringAnalyticsPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_URL}/admin/hiring-analytics`, config);
            setData(res.data);
        } catch (err) {
            console.error('Hiring Analytics Error:', err);
            setError(err.response?.data?.message || 'Failed to load analytics.');
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-slate-500 font-medium">Loading analytics…</p>
            </div>
        );
    }

    // ── Error ──────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                <div className="p-4 bg-red-50 rounded-2xl">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <p className="text-slate-800 font-semibold">Something went wrong</p>
                <p className="text-slate-500 text-sm max-w-sm">{error}</p>
                <button onClick={fetchAnalytics} className="mt-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Retry
                </button>
            </div>
        );
    }

    const { overview, funnel, distribution, averages, monthlyTrend } = data;

    // Chart data
    const distributionChart = [
        { name: '85–100', count: distribution.range85to100, fill: COLORS.ready },
        { name: '70–84', count: distribution.range70to84, fill: COLORS.onTrack },
        { name: '50–69', count: distribution.range50to69, fill: COLORS.needsImprovement },
        { name: '<50', count: distribution.below50, fill: COLORS.highRisk }
    ];

    const pieData = distributionChart.filter(d => d.count > 0);

    const funnelChart = [
        { stage: 'Total Interns', count: funnel.total },
        { stage: 'On Track (70%+)', count: funnel.onTrack },
        { stage: 'Ready (85%+)', count: funnel.ready },
        { stage: 'Converted', count: funnel.converted }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* ── Header ────────────────────────── */}
            <header className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center space-x-5">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                            <Target className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                                Hiring Intel
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                Resource Efficiency Monitoring
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Capacity</span>
                            <span className="text-sm font-black text-slate-900 tabular-nums">
                                <span className="text-blue-600">Avg {overview.averageHireIndex}%</span> Accuracy
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Summary Cards ──────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                <SummaryCard label="Total Cohort" value={overview.totalInterns} icon={Users} color="bg-slate-700" />
                <SummaryCard label="Peak Performers" value={overview.readyCount} icon={CheckCircle} color="bg-emerald-500" subtitle="Ready for Hire" />
                <SummaryCard label="On-Track" value={overview.onTrackCount} icon={TrendingUp} color="bg-blue-500" subtitle="Consistent Growth" />
                <SummaryCard label="Steady" value={overview.needsImprovementCount} icon={AlertTriangle} color="bg-amber-500" subtitle="Needs Polish" />
                <SummaryCard label="Growth Needed" value={overview.highRiskCount} icon={ShieldAlert} color="bg-rose-500" subtitle="Low Velocity" />
                <SummaryCard label="Global Rating" value={`${overview.averageHireIndex}%`} icon={Target} color="bg-blue-600" />
            </div>

            {/* ── Charts Row ────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Funnel Chart */}
                <div className="card p-8">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 px-2 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Recruitment Conversion
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={funnelChart} layout="vertical" barCategoryGap="40%">
                            <CartesianGrid strokeDasharray="8 8" stroke="#f1f5f9" horizontal={false} opacity={0.3} />
                            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="stage" width={110} tick={{ fill: '#475569', fontSize: 11, fontWeight: 800 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8faff' }} />
                            <Bar dataKey="count" name="Interns" radius={[0, 12, 12, 0]} fill="url(#analyticsGradient)" />
                            <defs>
                                <linearGradient id="analyticsGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Score Distribution */}
                <div className="card p-8">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 px-2 flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        Rating Segmentation
                    </h3>
                    {pieData.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="relative flex-1">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={75}
                                            outerRadius={105}
                                            paddingAngle={6}
                                            dataKey="count"
                                            nameKey="name"
                                            strokeWidth={0}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={index} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer shadow-lg" />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</span>
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">Spread</span>
                                </div>
                            </div>
                            <div className="space-y-4 shrink-0 px-2 min-w-[160px]">
                                {distributionChart.map((d) => (
                                    <div key={d.name} className="flex items-center gap-4 group cursor-default">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.05)] transition-transform group-hover:scale-125" style={{ backgroundColor: d.fill }} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{d.name} Index</span>
                                            <span className="text-sm font-black text-slate-800 tabular-nums">{d.count} Interns</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center py-12 font-medium">No distribution data yet.</p>
                    )}
                </div>
            </div>

            {/* ── Avg Metrics Breakdown ──────────── */}
            <div className="card p-10 bg-white">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 px-2 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Cohort Performance Benchmarks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10">
                    <MetricBar label="Primary Tasking" value={averages.taskCompletion} />
                    <MetricBar label="Deadline Velocity" value={averages.deadlineConsistency} />
                    <MetricBar label="Resource Value" value={averages.mentorRating} />
                    <MetricBar label="Deliverable Quality" value={averages.codeQuality} />
                    <MetricBar label="Ecosystem Activity" value={averages.githubActivity} />
                    <MetricBar label="Sync Effectiveness" value={averages.communication} />
                </div>
            </div>

            {/* ── Monthly Trend ─────────────────── */}
            {monthlyTrend && monthlyTrend.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Monthly HireIndex Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                             <Line
                                type="monotone"
                                dataKey="averageHireIndex"
                                name="Avg HireIndex"
                                stroke="#3b82f6"
                                strokeWidth={4}
                                dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalAnalyzed"
                                name="Interns Analyzed"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                strokeDasharray="8 8"
                                dot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* ── Footer Legend ──────────────────── */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Conversion Thresholds</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            ≥85% Ready · ≥70% On Track · ≥50% Needs Work · &lt;50% High Risk
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Enterprise Edition</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Data powered by Nexora Intelligence™</p>
                </div>
            </div>
        </div>
    );
};

export default HiringAnalyticsPage;
