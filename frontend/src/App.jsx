import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './components/MainLayout';
import HireIndexPage from './pages/HireIndexPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AICoachPage from './pages/AICoachPage';
import HiringAnalyticsPage from './pages/admin/HiringAnalyticsPage';
import LearningHubPage from './pages/LearningHubPage';
import InternTasksPage from './pages/InternTasksPage';
import TaskSubmissionPage from './pages/TaskSubmissionPage';
import MentorReviewPage from './pages/MentorReviewPage';

function App() {
  return (
    <Router>
      <AuthProvider>
          <div className="min-h-screen" style={{ background: '#f0f2f5' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LandingPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interns" element={<Dashboard defaultView="interns" />} />
                <Route path="/reports" element={<Dashboard defaultView="reports" />} />
                <Route path="/tasks" element={<InternTasksPage />} />
                <Route path="/tasks/submit/:id" element={<TaskSubmissionPage />} />
                <Route path="/mentor/submissions" element={<MentorReviewPage />} />
                <Route path="/hireindex" element={<HireIndexPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/ai-coach" element={<AICoachPage />} />
                <Route path="/admin/hiring-analytics" element={<HiringAnalyticsPage />} />
                <Route path="/learning-hub" element={<LearningHubPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
