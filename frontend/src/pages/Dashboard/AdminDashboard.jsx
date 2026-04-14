import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BarChart, ChevronRight, Clock, User as UserIcon, CheckCircle, PlusCircle, Award, Activity as ActivityIcon, RefreshCw, Zap, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TopPerformersCard from '../../components/TopPerformersCard';
import API_URL from '../../api';


const AdminDashboard = ({ setActiveView }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const fetchData = async () => {
        try {
            setRefreshing(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [tasksRes, activityRes] = await Promise.all([
                axios.get(`${API_URL}/tasks`, config),
                axios.get(`${API_URL}/activity`, config)
            ]);
            setTasks(tasksRes.data);
            setActivities(activityRes.data);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleExportSystem = async () => {
        setExporting(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const res = await axios.get(`${API_URL}/export/system/pdf`, config);

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Nexora_System_Analytics.pdf');
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

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const getActivityIcon = (action) => {
        switch (action) {
            case 'intern_registered':
            case 'registered': return <UserIcon className="w-4 h-4 text-blue-500" />;
            case 'task_created': return <PlusCircle className="w-4 h-4 text-green-500" />;
            case 'task_completed':
            case 'task_submitted': return <Clock className="w-4 h-4 text-orange-500" />;
            case 'task_graded': return <Award className="w-4 h-4 text-purple-500" />;
            case 'generated': return <Zap className="w-4 h-4 text-yellow-500" />;
            default: return <ActivityIcon className="w-4 h-4 text-slate-500" />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-900/10 border border-slate-800">
                        <ActivityIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">System Orchestration</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Real-time Global Network Activity</p>
                    </div>
                </div>
                <button
                    onClick={handleExportSystem}
                    disabled={exporting}
                    className="btn btn-secondary px-6 py-3 rounded-2xl"
                >
                    {exporting ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mr-3" />
                    ) : (
                        <Download className="w-5 h-5 mr-3" />
                    )}
                    Snapshot Analysis
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => setActiveView('interns')}
                    className="stat-card cursor-pointer group hover:scale-[1.01] transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderColor: '#334155' }}
                >
                    <div className="flex items-center justify-between relative z-10 px-2 py-1">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors border border-white/10">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Management</p>
                                <h3 className="text-xl font-black text-white tracking-tight">Active Intern Directory</h3>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-5 relative z-10 px-2 py-1">
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
                            <BarChart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Task Velocity</p>
                            <h3 className="text-2xl font-black text-slate-900 tabular-nums">{tasks.length} Assigned</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="card overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <h2 className="text-base font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                Activity Hub
                            </h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={fetchData}
                                    disabled={refreshing}
                                    className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200 disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
                                </button>
                                <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Real-time</span>
                            </div>
                        </div>
                        <div>
                            {loading ? (
                                <div className="p-12 text-center text-slate-400 text-sm">Loading activities...</div>
                            ) : activities.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 text-sm">No recent activity found.</div>
                            ) : (
                                activities.slice(0, 6).map((activity) => (
                                    <div key={activity._id} className="px-8 py-6 hover:bg-slate-50/80 transition-all flex items-start gap-6 border-b border-slate-100 last:border-b-0 group">
                                        <div className="mt-0.5 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:border-blue-200 transition-colors">
                                            {getActivityIcon(activity.action)}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start gap-4 mb-1.5">
                                                <p className="text-sm text-slate-800 font-medium">
                                                    <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{activity.user?.name}</span>
                                                    <span className="mx-2 text-slate-400 font-black uppercase text-[10px] tracking-tighter">({activity.role})</span>
                                                    <span className="text-slate-500">{activity.action.replace('_', ' ')}:</span> {activity.entity}
                                                </p>
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 tabular-nums">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTime(activity.createdAt)}
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                Security Clearance Level: {activity.role}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <TopPerformersCard />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
