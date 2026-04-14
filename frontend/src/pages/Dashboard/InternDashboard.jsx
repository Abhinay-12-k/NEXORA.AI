import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, BarChart2, Award, Zap, CheckSquare, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TopPerformersCard from '../../components/TopPerformersCard';
import API_URL from '../../api';


const getPerformanceStatus = (score) => {
    if (score >= 85) return { label: 'Peak Performance', color: 'bg-emerald-500' };
    if (score >= 70) return { label: 'Optimal', color: 'bg-blue-500' };
    if (score >= 50) return { label: 'Steady', color: 'bg-amber-500' };
    return { label: 'Growth Phase', color: 'bg-rose-500' };
};

const getTrend = (current, previous) => {
    if (previous === undefined || previous === null) return null;
    const diff = current - previous;
    const isPositive = diff > 0;
    const isNegative = diff < 0;

    return {
        text: `${isPositive ? '+' : ''}${diff.toFixed(1)}% from last week`,
        icon: isPositive ? '↑' : isNegative ? '↓' : '',
        color: isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-slate-400'
    };
};

const getMotivationalMessage = (score) => {
    if (score === undefined || score === null) return null;

    const isExcellent = score >= 85;
    const gap = (85 - score).toFixed(1);

    return (
        <div className="relative mt-8 mb-4 animate-fadeIn">
            <div className="relative flex items-center bg-white rounded-2xl px-6 py-6 border border-slate-100 shadow-xl shadow-blue-500/5">
                <div className="relative z-10 flex-1">
                    {isExcellent ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                                <Award className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Elite Performance Status Attained</h3>
                                <p className="text-slate-500 font-medium text-sm">You've reached the upper percentile of active contributors. Keep your momentum high! 🚀</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                                <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Analytics Pro Insight</h3>
                                <p className="text-slate-500 font-medium text-sm">You're just <span className="text-blue-600 font-bold">{gap}%</span> from reaching a <span className="font-bold">Peak Performance</span> rating. You've got this!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Subtle analytic graph backdrop */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03] pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                        <path d="M0,100 Q20,10 40,80 T80,20 T100,50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const InternDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                // Fetch Tasks
                const tasksRes = await axios.get(`${API_URL}/tasks`, config);
                setTasks(tasksRes.data);

                // Fetch Submissions
                const subsRes = await axios.get(`${API_URL}/submissions`, config);
                setSubmissions(subsRes.data);

                // Fetch Performance
                const perfRes = await axios.get(`${API_URL}/performance/${user._id}`, config);
                setPerformance(perfRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [user.token, user._id]);

    const handleTaskCompletion = async (taskId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`${API_URL}/tasks/${taskId}`, { status: 'completed' }, config);
            // Refresh tasks
            const tasksRes = await axios.get(`${API_URL}/tasks`, config);
            setTasks(tasksRes.data);
            // Refresh performance
            const perfRes = await axios.get(`${API_URL}/performance/${user._id}`, config);
            setPerformance(perfRes.data);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const getAiFeedback = async () => {
        setAiLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setAiError(null);

            const res = await axios.post(`${API_URL}/ai-feedback/${user._id}`, {}, config);
            setAiFeedback(res.data);
            setAiLoading(false);
        } catch (error) {
            console.error("Error getting AI feedback:", error);
            setAiError(error.response?.data?.message || "AI Service unavailable");
            setAiLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="page-header">
                <h1 className="page-title">Hello, {user.name} 👋</h1>
                <p className="page-subtitle">Here's your performance overview for today.</p>
                {performance && getMotivationalMessage(performance.overallScore)}
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Score</p>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-2xl font-bold text-slate-900">{performance?.overallScore || 0}<span className="text-base text-slate-400 font-medium">/100</span></p>
                                {performance?.overallScore !== undefined && (
                                    <span className={`status-badge text-white ${getPerformanceStatus(performance.overallScore).color}`}>
                                        {getPerformanceStatus(performance.overallScore).label}
                                    </span>
                                )}
                            </div>
                            {performance?.overallScore !== undefined && (
                                <div className={`trend-text ${getTrend(performance.overallScore, performance.previousScore)?.color}`}>
                                    {getTrend(performance.overallScore, performance.previousScore) ? (
                                        <>
                                            <span className="mr-0.5">{getTrend(performance.overallScore, performance.previousScore).icon}</span>
                                            {getTrend(performance.overallScore, performance.previousScore).text}
                                        </>
                                    ) : (
                                        <span className="text-slate-400">No trend data</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="icon-box-blue">
                            <Award className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{performance?.completionRate || 0}<span className="text-base text-slate-400 font-medium">%</span></p>
                        </div>
                        <div className="icon-box-green">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Feedback</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{performance?.averageFeedbackScore || 0}<span className="text-base text-slate-400 font-medium">/10</span></p>
                        </div>
                        <div className="icon-box-purple">
                            <BarChart2 className="h-5 w-5 text-purple-500" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Tasks</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{Array.isArray(tasks) ? tasks.filter(t => t.status === 'pending').length : 0}</p>
                        </div>
                        <div className="icon-box-orange">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tasks List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-blue-500" />
                            Active Tasks
                        </h2>
                        <span className="badge badge-info">{Array.isArray(tasks) ? tasks.length : 0} total</span>
                    </div>
                    <div className="space-y-3">
                        {!Array.isArray(tasks) || tasks.length === 0 ? (
                            <div className="card text-center py-10">
                                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm">No tasks assigned yet.</p>
                            </div>
                        ) : (
                            tasks.map(task => {
                                const submission = submissions.find(s => s.taskId?._id === task._id);
                                return (
                                    <div key={task._id} className="card">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                                                    <span className={`badge text-xs ${
                                                        task.priority === 'high' ? 'badge-danger' :
                                                        task.priority === 'medium' ? 'badge-warning' :
                                                        'badge-success'
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">{task.description}</p>
                                                <p className="text-xs text-slate-400 mt-2 font-medium">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                                            </div>
                                            <div className="shrink-0">
                                                {submission ? (
                                                    <span className={`badge ${
                                                        submission.status === 'approved' ? 'badge-success' :
                                                        submission.status === 'rejected' ? 'badge-danger' :
                                                        'badge-warning'
                                                    }`}>
                                                        {submission.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                                        {submission.status}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/tasks/submit/${task._id}`)}
                                                        className="btn btn-primary text-xs px-3 py-1.5"
                                                    >
                                                        <Send className="w-3.5 h-3.5 mr-1.5" /> Submit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {submission?.mentorFeedback && (
                                            <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    <span className="font-semibold text-slate-800">Mentor Feedback:</span> {submission.mentorRating}/5 — {submission.mentorFeedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-8">
                    {/* AI Feedback Section */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-xl font-bold flex items-center text-slate-800">
                                <Zap className="w-6 h-6 mr-2 text-indigo-500" />
                                AI Coach
                            </h2>
                            <button
                                onClick={getAiFeedback}
                                disabled={aiLoading}
                                className="btn btn-primary text-sm px-4 py-2"
                            >
                                {aiLoading ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Thinking...
                                    </div>
                                ) : 'Analyze Me'}
                            </button>
                        </div>

                        {aiError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-600 flex items-start">
                                <span className="mr-2">⚠️</span>
                                {aiError}
                            </div>
                        )}

                        {!aiFeedback ? (
                            <div className="text-center py-10">
                                <p className="text-slate-500 max-w-[240px] mx-auto text-sm leading-relaxed">
                                    Click "Analyze Me" to get personalized performance insights and a roadmap for growth.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 text-sm animate-fadeIn relative z-10">
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <p className="font-bold text-indigo-500 mb-2 uppercase tracking-wider text-[11px]">Summary</p>
                                    <p className="text-slate-700 leading-relaxed text-sm">{aiFeedback.summary}</p>
                                </div>
                                <div className="space-y-3 px-2">
                                    <div className="font-bold text-slate-800 flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                                        Strengths
                                    </div>
                                    <ul className="space-y-2">
                                        {aiFeedback.strengths.map((s, i) => (
                                            <li key={i} className="text-slate-600 flex items-start">
                                                <span className="text-emerald-500 mr-2">✓</span>
                                                {typeof s === 'object' ? (s.description || s.area || JSON.stringify(s)) : s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-3 px-2">
                                    <div className="font-bold text-slate-800 flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                                        🚀 Growth Roadmap
                                    </div>
                                    <ul className="space-y-3">
                                        {aiFeedback.roadmap.map((item, i) => (
                                            <li key={i} className="flex items-start bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                                                <span className="font-bold text-indigo-500 mr-3">{i + 1}.</span>
                                                <span className="text-slate-600 leading-relaxed font-medium">
                                                    {typeof item === 'object' ? (item.description || item.area || JSON.stringify(item)) : item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Top Performers Leaderboard */}
                    <TopPerformersCard />

                </div>
            </div>
        </div>
    );
};

export default InternDashboard;