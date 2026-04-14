const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorMiddleware');

const path = require('path');
// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('🔹 Environment Variables Loaded from:', path.join(__dirname, '.env'));

// Connect to Database
connectDB();

// Initialize Notification Service (Sets up event listeners)
require('./src/modules/notifications/notification.service');
// Initialize Scheduler (Sets up cron jobs)
require('./src/modules/notifications/scheduler.service');

const app = express();

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes (Placeholders for now)
app.use('/api/auth', require('./src/modules/auth/auth.routes'));
app.use('/api/users', require('./src/modules/users/user.routes'));
app.use('/api/tasks', require('./src/modules/tasks/task.routes'));
app.use('/api/submissions', require('./src/modules/tasks/submission.routes'));
app.use('/api/performance', require('./src/modules/performance/performance.routes'));
app.use('/api/ai-feedback', require('./src/modules/ai/ai.routes'));
app.use('/api/activity', require('./src/modules/activity/activity.routes'));
app.use('/api/export', require('./src/modules/export/export.routes'));
app.use('/api/hireindex', require('./src/modules/hireIndex/hireIndex.routes'));
app.use('/api/leaderboard', require('./src/modules/leaderboard/leaderboard.routes'));
app.use('/api/ai-coach', require('./src/modules/aiCoach/aiCoach.routes'));
app.use('/api/admin', require('./src/modules/hiringAnalytics/hiringAnalytics.routes'));
app.use('/api/learning-hub', require('./src/modules/learningHub/learningHub.routes'));

console.log('✅ Nexora HireIndex™ Routes Registered at /api/hireindex');
console.log('✅ Leaderboard Routes Registered at /api/leaderboard');
console.log('✅ AI Coach Routes Registered at /api/ai-coach');
console.log('✅ Hiring Analytics Routes Registered at /api/admin/hiring-analytics');
console.log('✅ Learning Hub Routes Registered at /api/learning-hub');

// Base Routes
app.get('/', (req, res) => {
    res.send('Nexora AI API is running - v1.2.1 (HireIndex Fixed)');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        version: '1.2.1',
        modules: ['auth', 'users', 'tasks', 'performance', 'ai', 'activity', 'export', 'hireindex', 'leaderboard', 'ai-coach', 'hiring-analytics', 'learning-hub']
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
