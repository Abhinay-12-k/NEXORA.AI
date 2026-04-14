import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    BarChart3,
    Target,
    Trophy,
    Sparkles,
    PieChart,
    BookOpen,
    LogOut,
    ChevronLeft,
    ChevronRight,
    X,
    FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, toggleCollapse, isMobileOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard',
            roles: ['admin', 'mentor', 'intern']
        },
        {
            label: 'Tasks',
            icon: CheckSquare,
            path: '/tasks',
            roles: ['intern']
        },
        {
            label: 'Interns',
            icon: Users,
            path: '/interns',
            roles: ['admin', 'mentor']
        },
        {
            label: 'Submissions',
            icon: FileText,
            path: '/mentor/submissions',
            roles: ['mentor']
        },
        {
            label: 'AI Coach',
            icon: Sparkles,
            path: '/ai-coach',
            roles: ['intern']
        },
        {
            label: 'Learning Hub',
            icon: BookOpen,
            path: '/learning-hub',
            roles: ['intern']
        },
        {
            label: 'Reports',
            icon: BarChart3,
            path: '/reports',
            roles: ['intern'],
            isHeader: true
        },
        {
            label: 'Nexora HireIndex™',
            icon: Target,
            path: '/hireindex',
            roles: ['intern'],
            isSubItem: true
        },
        {
            label: 'Leaderboard',
            icon: Trophy,
            path: '/leaderboard',
            roles: ['admin', 'mentor', 'intern']
        },
        {
            label: 'Hiring Analytics',
            icon: PieChart,
            path: '/admin/hiring-analytics',
            roles: ['admin']
        }
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            <aside
                className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:relative lg:inset-auto ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'w-[72px]' : 'w-64'} flex flex-col`}
                style={{
                    background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.03)',
                    boxShadow: '10px 0 40px rgba(0,0,0,0.2)',
                }}
            >
                {/* Logo Area */}
                <div className={`flex items-center h-[68px] border-b border-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center px-4' : 'px-5 justify-between'}`}>
                    <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'space-x-0' : 'space-x-3'}`}>
                        <div className="w-9 h-9 flex items-center justify-center shrink-0 rounded-xl bg-white shadow-[0_4px_12px_rgba(255,255,255,0.1)] p-1">
                            <img src="/nexoralogo.png" alt="Nexora Logo" className="w-full h-full object-contain" />
                        </div>
                        {!isCollapsed && (
                            <div className="ml-3">
                                <span className="text-base font-black text-white tracking-tighter uppercase">
                                    Nexora<span className="text-blue-500">AI</span>
                                </span>
                                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black -mt-1">Analytics Pro Plan</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={toggleCollapse}
                        className={`hidden lg:flex p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-all duration-200 ${isCollapsed ? 'absolute -right-3 top-7 bg-indigo-950 border border-indigo-500/30 shadow-md z-10 rounded-full w-6 h-6 p-0 items-center justify-center' : ''}`}
                    >
                        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>

                    <button onClick={toggleSidebar} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-indigo-300 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2 py-4' : 'px-3 py-4'}`}>
                    {!isCollapsed && (
                        <p className="text-[10px] font-semibold text-indigo-300/70 uppercase tracking-widest mb-3 px-2">Navigation</p>
                    )}
                    <nav className="space-y-1">
                        {filteredItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => toggleSidebar(false)}
                                    className={`flex items-center w-full rounded-xl group transition-all duration-200 ${
                                        isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                                    } ${
                                        isActive
                                            ? 'sidebar-active-item text-white'
                                            : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                                    } ${item.isSubItem && !isCollapsed ? 'ml-3' : ''}`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon
                                        className={`shrink-0 h-[18px] w-[18px] transition-all duration-300 ${
                                            isActive ? 'text-blue-500 scale-110' : 'text-slate-500 group-hover:text-blue-400'
                                        } ${isCollapsed ? '' : 'mr-3'}`}
                                    />
                                    {!isCollapsed && (
                                        <span className={`text-sm font-bold whitespace-nowrap overflow-hidden tracking-tight ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} ${item.isSubItem ? 'text-[13px] opacity-80' : ''}`}>
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && !isCollapsed && (
                                        <div className="ml-auto w-1 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* User + Logout */}
                <div
                    className={`w-full transition-all duration-300 ${isCollapsed ? 'px-2 py-4' : 'px-3 py-4'}`}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <div className={`flex items-center mb-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg border-2 border-white/10"
                            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-semibold text-white whitespace-nowrap truncate">{user?.name}</p>
                                <p className="text-[10px] text-indigo-300 uppercase font-semibold tracking-widest">{user?.role}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={`flex items-center w-full text-indigo-300 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 text-sm'}`}
                        title={isCollapsed ? 'Sign Out' : undefined}
                    >
                        <LogOut className={`shrink-0 h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
