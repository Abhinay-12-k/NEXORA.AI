import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Zap, Download, Activity, Target, BrainCircuit, LineChart as LineIcon } from 'lucide-react';
import {
    LineChart,
    AreaChart,
    Area,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Sector
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../api';

// ─── Combined Metric Donut Chart ────────────────────────────────────────────────
const CombinedMetricPie = ({ data }) => {
    return (
        <div className="card h-full flex flex-col">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Metrics Distribution</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={105}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color} 
                                    className="hover:opacity-80 transition-opacity"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                return (
                                    <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl text-xs shadow-2xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ backgroundColor: payload[0].payload.color }}></div>
                                            <span className="font-bold">{payload[0].name}:</span>
                                            <span className="font-black text-blue-400">{Math.round(payload[0].value)}%</span>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balanced</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">Score</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition-all cursor-default">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                {item.name}
                            </span>
                            <span className="text-xs font-bold text-slate-800 mt-1">{item.value}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 text-xs animate-fadeIn">
            <p className="font-black mb-3 text-blue-400 uppercase tracking-widest text-[10px]">{label}</p>
            <div className="space-y-2">
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.fill }}></div>
                            <span className="text-slate-400 font-bold">{p.name}</span>
                        </div>
                        <span className="font-black text-white">{p.value}%</span>
                    </div>
                ))}
            </div>
            {payload[0]?.payload?.fullTitle && (
                <p className="mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-black italic uppercase tracking-tighter">
                    {payload[0].payload.fullTitle}
                </p>
            )}
        </div>
    );
};

const ReportsView = ({ targetIntern }) => {
    const { user } = useAuth();
    const [performance, setPerformance] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [exporting, setExporting] = useState(false);

    const reportUser = targetIntern || user;

    // Fetch performance + tasks on mount only
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const perfRes = await axios.get(`${API_URL}/performance/${reportUser._id}`, config);
                setPerformance(perfRes.data);

                const tasksRes = await axios.get(`${API_URL}/tasks`, config);
                const internTasks = tasksRes.data.filter(
                    t => (t.assignedTo?._id || t.assignedTo) === reportUser._id
                );
                setTasks(internTasks);

                const subsRes = await axios.get(`${API_URL}/submissions`, config);
                const internSubs = subsRes.data.filter(
                    s => (s.internId?._id || s.internId) === reportUser._id
                );
                setSubmissions(internSubs);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports data', error);
                setLoading(false);
            }
        };
        fetchAllData();
    }, [user.token, reportUser._id]);

    // AI is triggered manually — not on every render
    const handleGetAiFeedback = async () => {
        setAiLoading(true);
        setAiError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const aiRes = await axios.post(`${API_URL}/ai-feedback/${reportUser._id}`, {}, config);
            setAiFeedback(aiRes.data);
        } catch (err) {
            console.error('AI Error:', err);
            setAiError(err.response?.data?.message || err.message);
        } finally {
            setAiLoading(false);
        }
    };

    const handleExportPdf = async () => {
        setExporting(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const res = await axios.get(`${API_URL}/export/intern/${reportUser._id}/pdf`, config);

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Nexora_Report_${reportUser.name.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export Error:', err);
            alert('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    };

    // Chart data mapping submissions to 100-point scale for a SaaS dashboard look
    const barDataRaw = (submissions || [])
        .filter(s => s.status === 'approved' && s.mentorRating !== undefined && s.taskId)
        .slice(-8) // Show last 8 tasks
        .map((sub, index) => {
            const date = new Date(sub.submittedAt || Date.now());
            const month = date.toLocaleString('default', { month: 'short' });
            
            // Calculate Deadline Score (100 if on time, lower if late)
            const taskId = sub.taskId || {};
            const deadline = taskId.deadline ? new Date(taskId.deadline) : new Date(sub.submittedAt);
            const msLate = Math.max(0, new Date(sub.submittedAt) - deadline);
            const daysLate = msLate / (1000 * 60 * 60 * 24);
            const deadlineScore = Math.max(40, 100 - (daysLate * 15)); // Min 40 for visual balance
            
            return {
                name: month,
                score: (sub.mentorRating || 0) * 20, // 1-5 to 20-100
                deadline: Math.round(deadlineScore),
                fullTitle: taskId.title || 'Task',
            };
        });

    const barData = barDataRaw.length > 0 
        ? [{ name: 'Start', score: 0, deadline: 0, fullTitle: 'Initial Baseline' }, ...barDataRaw] 
        : [];

    const efficiencyValue = performance?.overallScore || 0;

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                        <Target className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Analytics Intelligence</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Advanced Performance Monitoring</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExportPdf}
                        disabled={exporting}
                        className="btn btn-secondary px-6"
                    >
                        {exporting ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Export Data
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 text-xl border-2 border-white">
                        {reportUser.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Performance Overview Area Chart */}
                <div className="xl:col-span-2 card p-8 h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-2xl shadow-sm border border-purple-100/50">
                                <LineIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Overview</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Historical Scoring Trend</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Primary</span>
                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Score</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Secondary</span>
                                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-100/50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                                    <span className="text-[11px] font-black text-purple-600 uppercase tracking-widest">Deadline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {barData.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            No performance data available yet.
                        </div>
                    ) : (
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="deadlineGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis 
                                        domain={[0, 100]} 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                        ticks={[0, 25, 50, 75, 100]}
                                    />
                                    <Tooltip 
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone" 
                                        dataKey="score" 
                                        name="Score"
                                        stroke="#3b82f6" 
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#scoreGradient)"
                                        animationDuration={1500}
                                    />
                                    <Area
                                        type="monotone" 
                                        dataKey="deadline" 
                                        name="Deadline"
                                        stroke="#8b5cf6" 
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#deadlineGradient)"
                                        animationDuration={1800}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Right: Performance Metric Pies */}
                <div className="xl:col-span-1 h-full">
                    <CombinedMetricPie 
                        data={[
                            { name: 'Completion', value: performance?.completionRate || 0, color: '#3b82f6' }, // Blue
                            { name: 'Feedback', value: (performance?.averageFeedbackScore || 0) * 10, color: '#7dd3fc' }, // Light Blue
                            { name: 'Deadline', value: performance?.deadlineDiscipline || 0, color: '#c084fc' }, // Purple
                            { name: 'Efficiency', value: performance?.overallScore || 0, color: '#f472b6' } // Pink
                        ]}
                    />
                </div>
            </div>

            {/* AI Coaching Section */}
            <div className="card">
                <div className="relative z-10 flex flex-col md:flex-row gap-12">
                    {/* Left: Summary + Roadmap */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100/50">
                                    <BrainCircuit className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Coaching Engine</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Automated Performance Analysis</p>
                                </div>
                            </div>
                            <button
                                onClick={handleGetAiFeedback}
                                disabled={aiLoading}
                                className="btn btn-primary px-8 py-3 rounded-2xl shadow-xl shadow-blue-500/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {aiLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 mr-3 fill-current" />
                                        {aiFeedback ? 'Re-Sync Data' : 'Initialize Analysis'}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* AI State */}
                        {!aiFeedback && !aiLoading && !aiError && (
                            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                                Click <strong>"Generate AI Report"</strong> to get a personalized performance analysis with strengths, weaknesses, and a growth roadmap.
                            </p>
                        )}

                        {aiLoading && (
                            <div className="animate-pulse flex space-x-2 items-center p-4">
                                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                                <span className="text-sm text-slate-500 ml-2">AI is analyzing performance data...</span>
                            </div>
                        )}

                        {aiError && !aiLoading && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                                <p className="font-semibold mb-1">⚠️ AI Service Unavailable</p>
                                <p>{aiError}</p>
                            </div>
                        )}

                        {aiFeedback && !aiLoading && (
                            <div className="space-y-4">
                                <p className="text-slate-600 text-sm leading-relaxed max-w-xl">{aiFeedback.summary}</p>
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500">🚀 Growth Roadmap</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {aiFeedback.roadmap?.map((item, i) => (
                                            <div key={i} className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">{i + 1}</div>
                                                <span className="text-slate-700 text-sm font-medium">
                                                    {typeof item === 'object' ? (item.description || item.area || JSON.stringify(item)) : item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Strengths + Weaknesses */}
                    <div className="w-full md:w-80 space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                                Key Strengths
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {aiFeedback?.strengths ? (
                                    aiFeedback.strengths.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                                            {typeof s === 'object' ? (s.description || s.area || JSON.stringify(s)) : s}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Generate report to see strengths</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4 border-t border-slate-200 pt-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                                Focus Areas
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {aiFeedback?.weaknesses ? (
                                    aiFeedback.weaknesses.map((w, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                                            {typeof w === 'object' ? (w.description || w.area || JSON.stringify(w)) : w}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Generate report to see focus areas</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
