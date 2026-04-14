const asyncHandler = require('express-async-handler');
const Task = require('../tasks/task.model');
const User = require('../users/user.model');

const calculateOverallScore = (tasks) => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const totalTasksCount = tasks.length;
    const completedTasksCount = completedTasks.length;

    if (totalTasksCount === 0) return 0;

    const completionRate = (completedTasksCount / totalTasksCount) * 100;

    let totalScore = 0;
    let scoredTasksCount = 0;
    completedTasks.forEach(task => {
        if (task.feedbackScore !== undefined && task.feedbackScore !== null) {
            totalScore += task.feedbackScore;
            scoredTasksCount++;
        }
    });
    const averageFeedbackScore = scoredTasksCount === 0 ? 0 : (totalScore / scoredTasksCount);

    let onTimeTasksCount = 0;
    completedTasks.forEach(task => {
        if (task.submittedAt && task.deadline && new Date(task.submittedAt) <= new Date(task.deadline)) {
            onTimeTasksCount++;
        }
    });
    const deadlineDiscipline = completedTasksCount === 0 ? 0 : (onTimeTasksCount / completedTasksCount) * 100;

    const normalizedFeedback = averageFeedbackScore * 10;
    return (completionRate * 0.3) + (normalizedFeedback * 0.4) + (deadlineDiscipline * 0.3);
};

// @desc    Get performance metrics
// @route   GET /api/performance/:internId
// @access  Private (Admin/Mentor/Intern)
const getPerformance = asyncHandler(async (req, res) => {
    const internId = req.params.internId;
    const Intern = require('../users/intern.model');

    // Check permissions
    if (req.user.role === 'intern' && req.user.id !== internId) {
        res.status(401);
        throw new Error('Not authorized to view this performance');
    }

    let intern = await Intern.findOne({ user: internId });

    // Fallback if not evaluated yet
    if (!intern) {
        return res.status(200).json({
            totalTasks: 0,
            completedTasks: 0,
            completionRate: 0,
            averageFeedbackScore: 0,
            deadlineDiscipline: 0,
            overallScore: 0,
            previousScore: 0
        });
    }

    const completionRate = intern.totalTasksAssigned === 0 ? 0 : (intern.totalTasksCompleted / intern.totalTasksAssigned) * 100;
    const deadlineDiscipline = intern.totalTasksCompleted === 0 ? 0 : (intern.deadlinesMet / intern.totalTasksCompleted) * 100;

    res.status(200).json({
        totalTasks: intern.totalTasksAssigned,
        completedTasks: intern.totalTasksCompleted,
        completionRate: Math.round(completionRate * 10) / 10,
        averageFeedbackScore: Math.round(intern.mentorRatingAverage * 2 * 10) / 10, // Scale 1-5 to 1-10
        deadlineDiscipline: Math.round(deadlineDiscipline * 10) / 10,
        overallScore: intern.hireIndexScore,
        previousScore: Math.round((intern.hireIndexScore - intern.hireIndexTrend) * 10) / 10,
        githubScore: Math.round((intern.githubCommitCount / 10) * 10) / 10, // 0-100 -> 0-10
        codeQualityScore: Math.round((intern.codeQualityScore / 10) * 10) / 10, // 0-100 -> 0-10
        communicationScore: Math.round((intern.communicationScore / 10) * 10) / 10 // 0-100 -> 0-10
    });
});

// @desc    Get top performers
// @route   GET /api/performance/top
// @access  Private
const getTopPerformers = asyncHandler(async (req, res) => {
    const Intern = require('../users/intern.model');

    // Fetch top 5 performers based on their Nexora HireIndex™ Score
    const topInterns = await Intern.find()
        .populate('user', 'name')
        .sort({ hireIndexScore: -1 })
        .limit(5);

    const performers = topInterns.map((intern, index) => ({
        id: intern.user?._id || intern._id,
        name: intern.user?.name || 'Anonymous Intern',
        score: intern.hireIndexScore || 0,
        rank: index + 1
    }));

    res.status(200).json(performers);
});

module.exports = {
    getPerformance,
    getTopPerformers
};
