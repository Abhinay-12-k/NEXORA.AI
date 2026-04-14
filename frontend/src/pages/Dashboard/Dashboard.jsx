import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import InternDashboard from './InternDashboard';
import MentorDashboard from './MentorDashboard';
import AdminDashboard from './AdminDashboard';
import InternListView from './InternListView';
import ReportsView from './ReportsView';

const Dashboard = ({ defaultView = 'dashboard' }) => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState(defaultView);
    const [selectedIntern, setSelectedIntern] = useState(null);

    // Sync state if prop changes (e.g. navigating via Sidebar)
    useEffect(() => {
        setActiveView(defaultView);
    }, [defaultView]);

    const navigateToReport = (intern) => {
        setSelectedIntern(intern);
        setActiveView('reports');
    };

    const getDashboardComponent = () => {
        if (activeView === 'reports') return <ReportsView targetIntern={selectedIntern} />;
        if (activeView === 'interns' && user?.role !== 'intern') return <InternListView onViewReport={navigateToReport} />;
        if (activeView === 'tasks' && user?.role === 'intern') return <InternDashboard />;

        switch (user?.role) {
            case 'admin':
                return <AdminDashboard setActiveView={setActiveView} />;
            case 'mentor':
                return <MentorDashboard />;
            case 'intern':
                return <InternDashboard />;
            default:
                return <div>Role not recognized</div>;
        }
    };

    return (
        <div className="animate-fadeIn">
            {getDashboardComponent()}
        </div>
    );
};

export default Dashboard;
