const cron = require('node-cron');
const Task = require('../tasks/task.model');
const User = require('../users/user.model');
const appEmitter = require('../../utils/eventEmitter');

/**
 * Scheduler Service - Handles time-based triggers and recurring jobs.
 */
class SchedulerService {
    constructor() {
        this.initCronJobs();
    }

    initCronJobs() {
        console.log('[SchedulerService] Initializing scheduled jobs...');

        // 1. Deadline Reminder (Runs every hour)
        cron.schedule('0 * * * *', async () => {
            console.log('[SchedulerService] Checking for task deadlines...');
            await this.checkDeadlines();
        });

        // 2. Weekly Performance Summary (Runs every Sunday at 8 PM)
        cron.schedule('0 20 * * 0', async () => {
            console.log('[SchedulerService] Processing weekly summaries...');
            await this.processWeeklySummaries();
        });

        // 3. Readiness Check (Runs daily at 9 AM)
        cron.schedule('0 9 * * *', async () => {
            console.log('[SchedulerService] Running readiness checks...');
            await this.runReadinessChecks();
        });
    }

    /**
     * Check for tasks due in exactly 24 hours (within 1-hour window)
     */
    async checkDeadlines() {
        const tomorrow = new Date();
        tomorrow.setHours(tomorrow.getHours() + 24);

        const startRange = new Date(tomorrow);
        startRange.setMinutes(0);
        startRange.setSeconds(0);

        const endRange = new Date(tomorrow);
        endRange.setMinutes(59);
        endRange.setSeconds(59);

        const approachingTasks = await Task.find({
            deadline: { $gte: startRange, $lte: endRange },
            status: { $ne: 'completed' }
        }).populate('assignedTo', 'email');

        for (const task of approachingTasks) {
            if (task.assignedTo && task.assignedTo.email) {
                appEmitter.emit('task.deadline.reminder', {
                    internEmail: task.assignedTo.email,
                    taskTitle: task.title,
                    taskId: task._id
                });
            }
        }
    }

    /**
     * Aggregate performance and send weekly emails to all interns
     */
    async processWeeklySummaries() {
        const interns = await User.find({ role: 'intern' });

        for (const intern of interns) {
            // In a real app, calculate metrics from Task model
            // This is a placeholder for demonstration
            appEmitter.emit('performance.weekly', {
                email: intern.email,
                tasksCompleted: 3,
                avgScore: 88,
                missedDeadlines: 0,
                hireIndex: 82,
                aiRecommendation: "Great work! Next week, try focusing on more complex algorithms.",
            });
        }
    }

    /**
     * Check HireIndex thresholds for interns
     */
    async runReadinessChecks() {
        const interns = await User.find({ role: 'intern' });

        for (const intern of interns) {
            // Check for high performance readiness
            // Placeholder threshold: 80%
            const hireIndex = 85; // This would come from dynamic calculation

            if (hireIndex >= 80) {
                appEmitter.emit('performance.readiness', {
                    email: intern.email,
                    isPositive: true,
                    message: "Congratulations! Your performance has crossed the 80% HireIndex threshold.",
                    hireIndex: hireIndex,
                    gapAnalysis: "You are excelling in technical execution. Minor room for improvement in team communication.",
                    nextSteps: "Schedule a mock interview with your mentor to prepare for full-time opportunities."
                });
            }
        }
    }
}

module.exports = new SchedulerService();
