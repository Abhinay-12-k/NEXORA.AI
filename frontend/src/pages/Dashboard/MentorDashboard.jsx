import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ClipboardList, CheckSquare, Plus, Search, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TopPerformersCard from '../../components/TopPerformersCard';
import API_URL from '../../api';

const MentorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [interns, setInterns] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        deadline: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch Tasks
                const tasksRes = await axios.get(`${API_URL}/tasks`, config);
                setTasks(tasksRes.data);

                // Fetch Submissions
                const subsRes = await axios.get(`${API_URL}/submissions`, config);
                setSubmissions(subsRes.data);

                // Fetch Interns
                const internsRes = await axios.get(`${API_URL}/users/interns`, config);
                setInterns(internsRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [user.token]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/tasks`, newTask, config);
            setShowCreateModal(false);
            // Refresh tasks
            const res = await axios.get(`${API_URL}/tasks`, config);
            setTasks(res.data);
            setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating task');
        }
    };

    const handleGradeTask = async (taskId, score, comment) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Formula requires innovationScore, but for now we use 0 as default if not prompted
            await axios.put(`${API_URL}/tasks/${taskId}`, { feedbackScore: score, feedbackComment: comment, innovationScore: 0 }, config);
            // Refresh tasks
            const res = await axios.get(`${API_URL}/tasks`, config);
            setTasks(res.data);
        } catch (error) {
            console.error("Error grading task", error);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Mentor Command</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Resource & Performance Management</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary px-6 py-3 rounded-2xl shadow-xl shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Assign New Task
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Assigned</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{tasks.length}</p>
                        </div>
                        <div className="icon-box-blue">
                            <ClipboardList className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{tasks.filter(t => t.status === 'completed').length}</p>
                        </div>
                        <div className="icon-box-green">
                            <CheckSquare className="h-5 w-5 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Interns</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{interns.length}</p>
                        </div>
                        <div className="icon-box-purple">
                            <Users className="h-5 w-5 text-purple-500" />
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{submissions.filter(s => s.status === 'pending').length}</p>
                        </div>
                        <div className="icon-box-orange">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Tasks Management */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-base font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                            Task Management
                        </h2>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tasks or interns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-11 py-2.5 text-sm w-64 rounded-xl border-slate-100 bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <div className="table-container">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="table-header-row">
                                        <th>Title</th>
                                        <th>Assigned To</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                        <th>Score</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks
                                        .filter(task =>
                                            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            (task.assignedTo?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .slice(0, 5)
                                        .map(task => (
                                            <tr key={task._id} className="table-row">
                                                <td className="table-cell font-medium text-slate-900">{task.title}</td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                                            {task.assignedTo?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="text-slate-700">{task.assignedTo?.name || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="table-cell text-slate-500">{new Date(task.deadline).toLocaleDateString()}</td>
                                                <td className="table-cell">
                                                    <span className={`badge ${
                                                        task.status === 'completed' ? 'badge-success' : 'badge-warning'
                                                    }`}>{task.status}</span>
                                                </td>
                                                <td className="table-cell font-semibold">
                                                    {task.feedbackScore ? (
                                                        <span className="text-emerald-600">{task.feedbackScore}/10</span>
                                                    ) : <span className="text-slate-300">—</span>}
                                                </td>
                                                <td className="table-cell">
                                                    {submissions.find(s => s.taskId?._id === task._id && s.status === 'pending') ? (
                                                        <button
                                                            onClick={() => navigate('/mentor/submissions')}
                                                            className="text-blue-600 hover:text-blue-800 font-semibold text-xs transition-colors"
                                                        >
                                                            Review →
                                                        </button>
                                                    ) : submissions.find(s => s.taskId?._id === task._id && s.status === 'approved') ? (
                                                        <span className="badge badge-success">Approved</span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">Waiting</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <TopPerformersCard />
                </div>
            </div>

            {/* Create Task Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fadeIn">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Assign New Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    className="input-field min-h-[100px]"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign To (Intern)</label>
                                    <select
                                        required
                                        className="input-field"
                                        value={newTask.assignedTo}
                                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    >
                                        <option value="">{interns.length === 0 ? "No Interns Found" : "Select Intern"}</option>
                                        {interns.map(intern => (
                                            <option key={intern._id} value={intern._id}>{intern.name} ({intern.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={newTask.deadline}
                                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                <select
                                    className="input-field"
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorDashboard;
