import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../api';
import {
    Send,
    Github,
    Globe,
    FileText,
    MessageSquare,
    ArrowLeft,
    CheckCircle2,
    Loader2
} from 'lucide-react';

const TaskSubmissionPage = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        githubLink: '',
        liveLink: '',
        documentLink: '',
        notes: ''
    });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get(`${API_URL}/tasks/${id}`, config);
                setTask(res.data);
            } catch (error) {
                console.error('Error fetching task:', error);
                navigate('/tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id, user.token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.githubLink && !formData.liveLink && !formData.documentLink) {
            alert('Please provide at least one submission link (GitHub, Live Demo, or Document).');
            return;
        }

        setSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/tasks/${id}/submit`, formData, config);
            alert('Task submitted successfully!');
            navigate('/tasks');
        } catch (error) {
            alert(error.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sky-500" /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <button onClick={() => navigate('/tasks')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-sky-500 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Tasks
            </button>

            <div className="card overflow-hidden relative">
                <div className="relative z-10">
                    <header className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-semibold uppercase tracking-widest mb-3 border border-indigo-100">
                            Task Submission
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">{task?.title}</h1>
                        <p className="text-slate-500 text-sm">Complete the form below to submit your contribution for review.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">GitHub Repository</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                        <Github className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900"
                                        value={formData.githubLink}
                                        onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Live Demo / Preview</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://your-demo.com"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900"
                                        value={formData.liveLink}
                                        onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Document Link (Optional)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <input
                                    type="url"
                                    placeholder="Google Drive, Notion, etc."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900"
                                    value={formData.documentLink}
                                    onChange={(e) => setFormData({ ...formData, documentLink: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Submission Notes</label>
                            <div className="relative group">
                                <div className="absolute top-4 left-4 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <textarea
                                    rows="4"
                                    placeholder="Explain your approach, libraries used, or any challenges faced..."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900 resize-none"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary w-full flex items-center justify-center gap-3 py-4"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <><Send className="w-5 h-5" /> Submit for Review</>}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card bg-slate-50 border-slate-100 flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                <p className="text-sm font-semibold text-slate-600 italic">
                    Note: Your submission will be evaluated based on code quality, deadline consistency, and overall implementation. This will directly impact your Nexora HireIndex™.
                </p>
            </div>
        </div>
    );
};

export default TaskSubmissionPage;
