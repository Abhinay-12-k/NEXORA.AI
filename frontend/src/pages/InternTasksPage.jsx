import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';
import {
    CheckSquare,
    Clock,
    AlertCircle,
    ExternalLink,
    Send,
    MessageSquare,
    Star,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';

const InternTasksPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Fetch tasks
            try {
                const tasksRes = await axios.get(`${API_URL}/tasks`, config);
                setTasks(tasksRes.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }

            // Fetch submissions
            try {
                const subsRes = await axios.get(`${API_URL}/submissions`, config);
                setSubmissions(subsRes.data);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }

            setLoading(false);
        };
        fetchData();
    }, [user.token]);

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-600 border-amber-100',
            approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            rejected: 'bg-rose-50 text-rose-600 border-rose-100',
            open: 'bg-blue-50 text-blue-600 border-blue-100',
            closed: 'bg-slate-50 text-slate-600 border-slate-100'
        };
        return (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${styles[status] || styles.open} uppercase tracking-[0.1em] shadow-sm`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                <p className="mt-4 text-slate-500 font-medium">Loading your ecosystem...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                        <CheckSquare className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Deliverables</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Assignment & Submission Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Queue Status</span>
                        <p className="text-sm font-black text-slate-900 tabular-nums">
                            <span className="text-blue-600">{tasks.filter(t => t.status === 'open').length} Tasks</span> Active
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {tasks.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                            <Clock className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">No tasks assigned yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm">When your mentor assigns you a task, it will appear here for you to work on.</p>
                    </div>
                ) : (
                    tasks.map((task) => {
                        const submission = submissions.find(s => s.taskId?._id === task._id);
                        return (
                            <div key={task._id} className="card group">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            {getStatusBadge(submission?.status || task.status)}
                                            {task.difficulty && (
                                                <span className="badge badge-neutral text-[10px] uppercase tracking-widest">
                                                    {task.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">{task.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{task.description}</p>

                                        <div className="flex flex-wrap items-center gap-5">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-xs font-semibold">Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-xs font-semibold">By: {task.createdBy?.name || 'Mentor'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6">
                                        {submission ? (
                                            <div className="space-y-3">
                                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Submission Record</p>
                                                    <div className="space-y-3">
                                                        {submission.githubLink && (
                                                            <a href={submission.githubLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all shadow-sm hover:shadow-md">
                                                                GitHub Repository <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                        <div className="flex items-center gap-2 px-1">
                                                            <Calendar className="w-3 h-3 text-slate-400" />
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finalized {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {submission.status === 'approved' && (
                                                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Rating Insight</span>
                                                            <div className="flex gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < submission.mentorRating ? 'fill-emerald-500 text-emerald-500' : 'text-emerald-200'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-bold text-emerald-900 leading-relaxed italic">"{submission.mentorFeedback}"</p>
                                                    </div>
                                                )}

                                                {submission.status === 'rejected' && (
                                                    <button
                                                        onClick={() => navigate(`/tasks/submit/${task._id}`)}
                                                        className="btn w-full" style={{background:'linear-gradient(135deg,#e11d48,#be123c)',color:'white',boxShadow:'0 2px 8px rgba(225,29,72,0.2)'}}
                                                    >
                                                        Resubmit <Send className="w-4 h-4 ml-2" />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col justify-center">
                                                <p className="text-slate-400 text-sm font-medium mb-4 text-center">Ready to show your skills?</p>
                                                <button
                                                    onClick={() => navigate(`/tasks/submit/${task._id}`)}
                                                    className="btn btn-primary w-full"
                                                >
                                                    Submit Task <Send className="w-4 h-4 ml-2" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default InternTasksPage;
