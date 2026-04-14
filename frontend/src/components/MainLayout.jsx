import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    const toggleSidebar = (force) => setIsSidebarOpen(typeof force === 'boolean' ? force : !isSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                isMobileOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    onClick={() => toggleSidebar(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto transition-all duration-300">
                {/* Mobile Header */}
                <header
                    className="lg:hidden sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
                    style={{ background: 'white', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
                >
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 p-1.5">
                            <img src="/nexoralogo.png" alt="Nexora Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[15px] font-bold text-slate-900 tracking-tight">
                            Nexora <span className="text-blue-600">AI</span>
                        </span>
                    </div>
                    <button
                        onClick={() => toggleSidebar(true)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </header>

                {/* Page Content */}
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
