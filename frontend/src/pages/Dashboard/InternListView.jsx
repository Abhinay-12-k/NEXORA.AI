import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, ChevronRight, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../api';

const InternListView = ({ onViewReport }) => {
    const { user } = useAuth();
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                console.log("Fetching interns with token:", user.token);
                const res = await axios.get(`${API_URL}/users/interns`, config);
                console.log("Interns response data:", res.data);
                setInterns(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching interns:", error);
                alert("Failed to fetch interns. Check console for details.");
                setLoading(false);
            }
        };
        fetchInterns();
    }, [user]);

    const filteredInterns = interns.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Human Capital</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Global Intern Talent Directory</p>
                    </div>
                </div>
                <div className="relative group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter talent..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 w-64 border border-slate-100 bg-slate-50/50 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInterns.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                        {searchTerm ? "No interns match your search." : "No interns found in the system. Register one to see them here."}
                    </div>
                ) : (
                    filteredInterns.map((intern) => (
                        <div key={intern._id} className="card group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10">
                            <div className="flex items-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-black text-2xl shadow-sm border border-blue-100 group-hover:from-blue-600 group-hover:to-indigo-700 group-hover:text-white transition-all duration-500">
                                    {intern.name.charAt(0)}
                                </div>
                                <div className="ml-5">
                                    <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none group-hover:text-blue-600 transition-colors">{intern.name}</h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mt-2">ID &middot; {intern._id.slice(-6)}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                                    <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                                    <span className="text-xs font-bold text-slate-600 truncate">{intern.email}</span>
                                </div>
                                <div className="flex items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                                    <Calendar className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                                    <span className="text-xs font-bold text-slate-600">Enrolled {new Date(intern.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onViewReport(intern)}
                                className="w-full py-4 bg-slate-900 text-white hover:bg-blue-600 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-slate-900/10 hover:shadow-blue-500/30"
                            >
                                Analytics Report <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InternListView;
