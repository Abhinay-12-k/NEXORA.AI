const appEmitter = require('../../utils/eventEmitter');
const emailService = require('./email.service');
const templates = require('./templates/emailTemplates');

/**
 * Notification Service - Handles events and triggers appropriate notifications.
 * Acts as the orchestration layer between events and low-level delivery services (like EmailService).
 */
class NotificationService {
    constructor() {
        this.initListeners();
    }

    initListeners() {
        console.log('[NotificationService] Initializing event listeners...');

        // 1. Welcome Email
        appEmitter.on('user.registered', async (data) => {
            console.log(`[NotificationService] Processing user.registered for ${data.email}`);
            await emailService.sendEmail({
                to: data.email,
                subject: `Welcome to Nexora AI, ${data.name}!`,
                html: templates.welcomeEmail({
                    name: data.name,
                    role: data.role,
                    loginLink: `${process.env.FRONTEND_URL}/login`,
                }),
            });
        });

        // 2. Task Assigned
        appEmitter.on('task.assigned', async (data) => {
            console.log(`[NotificationService] Processing task.assigned for ${data.internEmail}`);
            await emailService.sendEmail({
                to: data.internEmail,
                subject: `New Task Assigned: ${data.taskTitle}`,
                html: templates.taskAssigned({
                    taskTitle: data.taskTitle,
                    description: data.description,
                    deadline: new Date(data.deadline).toLocaleDateString(),
                    submissionLink: `${process.env.FRONTEND_URL}/tasks/${data.taskId}`,
                }),
            });
        });

        // 3. Task Submission
        appEmitter.on('task.submitted', async (data) => {
            console.log(`[NotificationService] Processing task.submitted for ${data.internEmail} and ${data.mentorEmail}`);

            // Email to Intern
            await emailService.sendEmail({
                to: data.internEmail,
                subject: 'Task Submission Confirmation',
                html: templates.taskSubmissionIntern({
                    taskTitle: data.taskTitle,
                    timestamp: data.timestamp,
                    dashboardLink: `${process.env.FRONTEND_URL}/dashboard`,
                }),
            });

            // Email to Mentor
            await emailService.sendEmail({
                to: data.mentorEmail,
                subject: `Intern Submission: ${data.internName}`,
                html: templates.taskSubmissionMentor({
                    internName: data.internName,
                    taskTitle: data.taskTitle,
                    reviewLink: `${process.env.FRONTEND_URL}/submissions/${data.submissionId}`,
                }),
            });
        });

        // 4. Task Graded
        appEmitter.on('task.graded', async (data) => {
            console.log(`[NotificationService] Processing task.graded for ${data.internEmail}`);
            await emailService.sendEmail({
                to: data.internEmail,
                subject: `Task Graded: ${data.taskTitle}`,
                html: templates.taskGraded({
                    taskTitle: data.taskTitle,
                    score: data.score,
                    feedback: data.feedback,
                    hireIndex: data.hireIndex,
                    suggestions: data.suggestions,
                    performanceLink: `${process.env.FRONTEND_URL}/performance`,
                }),
            });
        });

        // 5. Deadline Reminder
        appEmitter.on('task.deadline.reminder', async (data) => {
            console.log(`[NotificationService] Processing deadline reminder for ${data.internEmail}`);
            await emailService.sendEmail({
                to: data.internEmail,
                subject: `Action Required: Deadline Approaching for ${data.taskTitle}`,
                html: templates.deadlineReminder({
                    taskTitle: data.taskTitle,
                    submissionLink: `${process.env.FRONTEND_URL}/tasks/${data.taskId}`,
                }),
            });
        });

        // 6. Weekly Performance Summary
        appEmitter.on('performance.weekly', async (data) => {
            console.log(`[NotificationService] Processing weekly summary for ${data.email}`);
            await emailService.sendEmail({
                to: data.email,
                subject: 'Your Weekly Performance Summary',
                html: templates.weeklySummary({
                    tasksCompleted: data.tasksCompleted,
                    avgScore: data.avgScore,
                    missedDeadlines: data.missedDeadlines,
                    hireIndex: data.hireIndex,
                    aiRecommendation: data.aiRecommendation,
                    dashboardLink: `${process.env.FRONTEND_URL}/dashboard`,
                }),
            });
        });

        // 7. Full-Time Readiness Alert
        appEmitter.on('performance.readiness', async (data) => {
            console.log(`[NotificationService] Processing readiness alert for ${data.email}`);
            await emailService.sendEmail({
                to: data.email,
                subject: data.isPositive ? 'Nexora AI: Career Readiness Achievement' : 'Nexora AI: Performance Alert',
                html: templates.readinessAlert({
                    isPositive: data.isPositive,
                    message: data.message,
                    hireIndex: data.hireIndex,
                    gapAnalysis: data.gapAnalysis,
                    nextSteps: data.nextSteps,
                    careerLink: `${process.env.FRONTEND_URL}/career`,
                }),
            });
        });
    }
}

module.exports = new NotificationService();
