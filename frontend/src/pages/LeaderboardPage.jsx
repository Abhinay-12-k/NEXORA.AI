import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api';
import {
    Trophy,
    Medal,
    ChevronLeft,
    ChevronRight,
    Crown,
    TrendingUp,
    Users,
    Loader2,
    AlertCircle,
    Download
} from 'lucide-react';

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
    'Ready for Full-Time Conversion': {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },
    'On Track': {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
    },
    'Needs Improvement': {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },
    'High Risk': {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },
    'Pending': {
        bg: 'bg-slate-50',
        text: 'text-slate-500',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
    },
};

const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];

// ─── Rank badge ───────────────────────────────────────────────────────────────
const RankBadge = ({ rank }) => {
    if (rank === 1) return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg shadow-amber-200">
            <Crown className="w-5 h-5 text-white" />
        </div>
    );
    if (rank === 2) return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-md shadow-slate-200">
            <Medal className="w-5 h-5 text-white" />
        </div>
    );
    if (rank === 3) return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 shadow-md shadow-orange-200">
            <Medal className="w-5 h-5 text-white" />
        </div>
    );
    return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold text-sm">
            {rank}
        </div>
    );
};

// ─── Row highlight for top 3 ──────────────────────────────────────────────────
const ROW_HIGHLIGHT = {
    1: 'bg-gradient-to-r from-amber-50/80 via-yellow-50/60 to-transparent border-l-4 border-amber-400',
    2: 'bg-gradient-to-r from-slate-50/80 via-slate-50/40 to-transparent border-l-4 border-slate-400',
    3: 'bg-gradient-to-r from-orange-50/80 via-orange-50/40 to-transparent border-l-4 border-orange-400',
};

const getRowClass = (rank, isCurrentUser) => {
    const base = 'transition-all duration-200 hover:bg-indigo-50/30';
    if (isCurrentUser) return `${base} bg-indigo-50 ring-1 ring-inset ring-indigo-200`;
    return `${base} ${ROW_HIGHLIGHT[rank] || ''}`;
};

// ─── Score bar ────────────────────────────────────────────────────────────────
const ScoreBar = ({ score }) => {
    const percent = Math.min(100, Math.max(0, score));
    const color =
        percent >= 85 ? '#10b981'  // emerald
            : percent >= 70 ? '#3b82f6'  // blue
                : percent >= 50 ? '#f59e0b'  // amber
                    : '#ef4444';             // red

    return (
        <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 text-sm w-14 shrink-0 text-right tabular-nums">
                {percent.toFixed(1)}
            </span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[80px]">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Build page buttons (show at most 5 around current)
    const getPageNumbers = () => {
        const pages = [];
        const delta = 2;
        const left = Math.max(1, page - delta);
        const right = Math.min(totalPages, page + delta);
        for (let i = left; i <= right; i++) pages.push(i);
        return pages;
    };

    const btnBase =
        'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150';

    return (
        <div className="flex items-center justify-center gap-1.5 pt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className={`${btnBase} text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed`}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`${btnBase} ${p === page
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className={`${btnBase} text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed`}
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const LeaderboardPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [exporting, setExporting] = useState(false);
    const LIMIT = 10;

    const fetchLeaderboard = useCallback(async (targetPage) => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(
                `${API_URL}/leaderboard?page=${targetPage}&limit=${LIMIT}`,
                config
            );
            setData(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotal(res.data.total);
        } catch (err) {
            console.error('Leaderboard fetch error:', err);
            setError(err.response?.data?.message || 'Failed to load leaderboard. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const handleExportPdf = async () => {
        setExporting(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const res = await axios.get(`${API_URL}/export/leaderboard/pdf`, config);

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Nexora_Leaderboard.pdf');
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
        fetchLeaderboard(page);
    }, [page, fetchLeaderboard]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-slate-500 font-medium">Loading leaderboard…</p>
            </div>
        );
    }

    // ── Error state ────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                <div className="p-4 bg-red-50 rounded-2xl">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <div>
                    <p className="text-slate-800 font-semibold mb-1">Something went wrong</p>
                    <p className="text-slate-500 text-sm max-w-sm">{error}</p>
                </div>
                <button
                    onClick={() => fetchLeaderboard(page)}
                    className="mt-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* ── Header ────────────────────────────── */}
            <header className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                        <Trophy className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="page-title">Intern Leaderboard</h1>
                        <p className="page-subtitle">Ranked by Nexora HireIndex™</p>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-4 relative z-10">
                    <button
                        onClick={handleExportPdf}
                        disabled={exporting}
                        className="btn btn-primary px-6 shadow-xl shadow-blue-500/20"
                    >
                        {exporting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Export Rankings
                    </button>
                    {/* Stats pill */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-bold text-slate-700">
                            {total} Ranked
                        </span>
                    </div>
                </div>
            </header>

            {/* ── Table Card ────────────────────────── */}
            <div className="table-container">
                {/* Table header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            Rankings — Page {page} of {totalPages}
                        </span>
                    </div>
                    {user?.role === 'intern' && (
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            Your row is highlighted
                        </span>
                    )}
                </div>

                {/* Empty state */}
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="p-5 bg-slate-50 rounded-2xl">
                            <Trophy className="w-10 h-10 text-slate-300" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-slate-700 mb-1">No rankings yet</p>
                            <p className="text-sm text-slate-400 max-w-xs">
                                Interns need to run their HireIndex™ analysis first to appear here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4 w-20">Rank</th>
                                    <th className="px-6 py-4">Intern</th>
                                    <th className="px-6 py-4 min-w-[200px]">HireIndex™ Score</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.map((intern) => {
                                    const isCurrentUser =
                                        user?.role === 'intern' &&
                                        (intern.userId?.toString() === user?._id?.toString() ||
                                            intern.userId?.toString() === user?.id?.toString());
                                    const statusCfg = getStatusConfig(intern.hireIndexStatus);

                                    return (
                                        <tr
                                            key={intern._id}
                                            className={getRowClass(intern.rank, isCurrentUser)}
                                        >
                                            {/* Rank */}
                                            <td className="px-6 py-4">
                                                <RankBadge rank={intern.rank} />
                                            </td>

                                            {/* Name */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 shadow-sm">
                                                        {intern.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-sm leading-snug">
                                                            {intern.name}
                                                            {isCurrentUser && (
                                                                <span className="ml-2 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 align-middle">
                                                                    You
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Score */}
                                            <td className="px-6 py-4">
                                                <ScoreBar score={intern.hireIndexScore} />
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                                    {intern.hireIndexStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 pb-8">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* ── Legend card ───────────────────────── */}
            <div className="card flex flex-col sm:flex-row items-center justify-between gap-4" style={{background:'linear-gradient(135deg,#1e293b 0%,#334155 100%)',color:'white',border:'none'}}>
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/10 rounded-xl">
                        <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-base">Score Tiers</h3>
                        <p className="text-slate-400 text-sm mt-0.5">
                            ≥85 Ready · ≥70 On Track · ≥50 Needs Work · &lt;50 High Risk
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Gold (1st)
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Silver (2nd)
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> Bronze (3rd)
                </div>
            </div>

        </div>
    );
};

export default LeaderboardPage;

