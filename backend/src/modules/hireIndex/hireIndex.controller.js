const asyncHandler = require('express-async-handler');
const hireIndexService = require('./hireIndex.service');
const Intern = require('../users/intern.model');
const ActivityLog = require('../activity/activityLog.model');

/**
 * @desc    Analyze HireIndex for an intern (Manual Trigger)
 * @route   POST /api/hireindex/analyze
 * @access  Private (Intern)
 */
const analyzeHireIndex = asyncHandler(async (req, res) => {
    try {
        const internUserId = req.user._id;

        // Check Cooldown (5 minutes)
        const intern = await Intern.findOne({ user: internUserId });
        if (intern && intern.lastHireIndexAnalyzedAt) {
            const fiveMinutes = 5 * 60 * 1000;
            const timePassed = new Date() - new Date(intern.lastHireIndexAnalyzedAt);

            if (timePassed < fiveMinutes) {
                const timeLeft = Math.ceil((fiveMinutes - timePassed) / 1000 / 60);
                res.status(429);
                throw new Error(`Cooldown active. Please wait ${timeLeft} more minute(s) before re-analyzing.`);
            }
        }

        const report = await hireIndexService.calculateHireIndex(internUserId);

        // Log the activity
        await ActivityLog.create({
            user: internUserId,
            action: 'analyzed',
            entity: 'HireIndex',
            role: 'intern'
        });

        res.status(200).json({
            success: true,
            message: 'Nexora HireIndex™ analysis complete.',
            data: report
        });
    } catch (error) {
        console.error('[HireIndex Controller] Error:', error.message);
        console.error(error.stack);
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw error;
    }
});

/**
 * @desc    Get HireIndex Report for an intern
 * @route   GET /api/hireindex/report
 * @access  Private (Intern)
 */
const getHireIndexReport = asyncHandler(async (req, res) => {
    const internUserId = req.user._id;

    try {
        const report = await hireIndexService.getHireIndexReport(internUserId);
        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

/**
 * @desc    Get Top Performers for Admin (Based on HireIndex)
 * @route   GET /api/hireindex/top
 * @access  Private (Admin/Mentor)
 */
const getTopPerformers = asyncHandler(async (req, res) => {
    const interns = await Intern.find()
        .populate('user', 'name email')
        .sort({ hireIndexScore: -1 })
        .limit(5);

    res.status(200).json({
        success: true,
        data: interns
    });
});

/**
 * @desc    Get Stats for Admin Dashboard
 * @route   GET /api/hireindex/stats
 * @access  Private (Admin)
 */
const getAdminStats = asyncHandler(async (req, res) => {
    const topPerformers = await Intern.find()
        .populate('user', 'name')
        .sort({ hireIndexScore: -1 })
        .limit(5);

    const onTrack = await Intern.find({ hireIndexScore: { $gte: 70, $lt: 85 } })
        .populate('user', 'name')
        .limit(10);

    const atRisk = await Intern.find({ hireIndexScore: { $lt: 50 } })
        .populate('user', 'name')
        .limit(10);

    res.status(200).json({
        success: true,
        data: {
            topPerformers,
            onTrack,
            atRisk
        }
    });
});

module.exports = {
    analyzeHireIndex,
    getHireIndexReport,
    getTopPerformers,
    getAdminStats
};
