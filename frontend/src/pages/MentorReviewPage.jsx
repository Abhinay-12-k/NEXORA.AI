import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    FileText,
    CheckCircle,
    XCircle,
    Star,
    ExternalLink,
    MessageCircle,
    Clock,
    User,
    ChevronRight,
    Loader2,
    Calendar,
    Target
} from 'lucide-react';

import API_URL from '../api';

const MentorReviewPage = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewMode, setReviewMode] = useState(false);

    const [reviewForm, setReviewForm] = useState({
        status: 'approved',
        mentorFeedback: '',
        mentorRating: 5,
        githubScore: 8,
        codeQualityScore: 8,
        communicationScore: 8
    });

    const fetchSubmissions = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_URL}/submissions`, config);
            setSubmissions(res.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [user.token]);

    const handleReview = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.patch(`${API_URL}/submissions/${selectedSubmission._id}/review`, reviewForm, config);
            setReviewMode(false);
            fetchSubmissions();
            setSelectedSubmission(null);
        } catch (error) {
            alert('Review failed');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" /></div>;

    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    const processedSubmissions = submissions.filter(s => s.status !== 'pending');

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="page-title">Pending Submissions</h1>
                    <p className="page-subtitle">Queue Management &middot; Intern Performance Review</p>
                </div>
                <div
                    className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-3xl border border-slate-200 shadow-xl shadow-blue-500/5 relative z-10"
                >
                    <div className="icon-box-orange">
                        <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Queue Size</span>
                        <span className="text-3xl font-black text-slate-900 leading-none">{pendingSubmissions.length}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Scrollable Submissions List */}
                <div className="xl:col-span-2 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {pendingSubmissions.length === 0 ? (
                        <div className="card text-center p-16">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-800">All caught up!</h3>
                            <p className="text-slate-500 text-sm mt-2">No pending submissions awaiting review.</p>
                        </div>
                    ) : (
                        pendingSubmissions.map(sub => (
                            <div
                                key={sub._id}
                                onClick={() => setSelectedSubmission(sub)}
                                className={`group card p-6 border-2 transition-all cursor-pointer ${selectedSubmission?._id === sub._id ? 'border-indigo-500 shadow-md' : 'border-transparent hover:border-slate-200'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black">
                                            {sub.internId?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 leading-tight">{sub.taskId?.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <User className="w-3 h-3 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-500">{sub.internId?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest mb-1">Submitted</span>
                                        <span className="text-xs font-black text-slate-900">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {processedSubmissions.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 ml-2">Recent History</h3>
                            <div className="space-y-3">
                                {processedSubmissions.slice(0, 5).map(sub => (
                                    <div key={sub._id} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 opacity-70">
                                        <div className="flex items-center gap-3">
                                            {sub.status === 'approved' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                                            <span className="text-sm font-bold text-slate-700">{sub.internId?.name} - {sub.taskId?.title}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">{sub.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Review Panel */}
                <div className="xl:col-span-1">
                    {selectedSubmission ? (
                        <div className="card p-8 sticky top-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Submission Details</h3>

                            <div className="space-y-6 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intern Notes</p>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">{selectedSubmission.notes || "No notes provided."}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Production Deliverables</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedSubmission.githubLink && (
                                            <a href={selectedSubmission.githubLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-orange-50 text-primary rounded-xl hover:bg-orange-100 transition-colors">
                                                <div className="flex items-center gap-2 text-xs font-black"><FileText className="w-4 h-4" /> REPOSITORY</div>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                        {selectedSubmission.liveLink && (
                                            <a href={selectedSubmission.liveLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors">
                                                <div className="flex items-center gap-2 text-xs font-black"><Target className="w-4 h-4" /> LIVE DEMO</div>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleReview} className="space-y-6 pt-6 border-t border-slate-100">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mentor Guidelines</p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setReviewForm({ ...reviewForm, status: 'approved' })}
                                            className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${reviewForm.status === 'approved' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            <CheckCircle className="w-4 h-4" /> APPROVE
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReviewForm({ ...reviewForm, status: 'rejected' })}
                                            className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${reviewForm.status === 'rejected' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            <XCircle className="w-4 h-4" /> REJECT
                                        </button>
                                    </div>
                                </div>

                                {reviewForm.status === 'approved' && (
                                    <div className="space-y-6 pt-4 border-t border-slate-50">
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Technical Marks */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GitHub Contributions</p>
                                                        <p className="text-xs font-bold text-slate-700">Repository & Logic</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="range" min="0" max="10" step="1"
                                                            value={reviewForm.githubScore}
                                                            onChange={(e) => setReviewForm({ ...reviewForm, githubScore: parseInt(e.target.value) })}
                                                            className="w-24 accent-primary"
                                                        />
                                                        <span className="w-6 text-sm font-black text-primary">{reviewForm.githubScore}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Code Quality</p>
                                                        <p className="text-xs font-bold text-slate-700">Cleanliness & Style</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="range" min="0" max="10" step="1"
                                                            value={reviewForm.codeQualityScore}
                                                            onChange={(e) => setReviewForm({ ...reviewForm, codeQualityScore: parseInt(e.target.value) })}
                                                            className="w-24 accent-primary"
                                                        />
                                                        <span className="w-6 text-sm font-black text-primary">{reviewForm.codeQualityScore}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Communication</p>
                                                        <p className="text-xs font-bold text-slate-700">Notes & Response</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="range" min="0" max="10" step="1"
                                                            value={reviewForm.communicationScore}
                                                            onChange={(e) => setReviewForm({ ...reviewForm, communicationScore: parseInt(e.target.value) })}
                                                            className="w-24 accent-primary"
                                                        />
                                                        <span className="w-6 text-sm font-black text-primary">{reviewForm.communicationScore}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Rating (1-5)</label>
                                                <span className="text-lg font-black text-slate-900">{reviewForm.mentorRating}</span>
                                            </div>
                                            <div className="flex justify-between gap-1">
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setReviewForm({ ...reviewForm, mentorRating: num })}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${reviewForm.mentorRating >= num ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-300'}`}
                                                    >
                                                        <Star className={`w-5 h-5 ${reviewForm.mentorRating >= num ? 'fill-amber-600' : ''}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review Feedback</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Explain your decision..."
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        value={reviewForm.mentorFeedback}
                                        onChange={(e) => setReviewForm({ ...reviewForm, mentorFeedback: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                                >
                                    Complete Evaluation
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center card border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                                <MessageCircle className="w-8 h-8 text-slate-400" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">Selection Required</h4>
                            <p className="text-sm font-medium text-slate-500 mt-2">Choose a submission from the queue to begin the evaluation process.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentorReviewPage;
