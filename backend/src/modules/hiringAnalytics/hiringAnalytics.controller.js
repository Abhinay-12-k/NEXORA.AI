const asyncHandler = require('express-async-handler');
const { getHiringAnalytics } = require('./hiringAnalytics.service');

/**
 * @desc    Get hiring analytics dashboard data
 * @route   GET /api/admin/hiring-analytics
 * @access  Private (Admin only)
 */
const getHiringAnalyticsHandler = asyncHandler(async (req, res) => {
    const analytics = await getHiringAnalytics();

    res.status(200).json({
        success: true,
        ...analytics
    });
});

module.exports = { getHiringAnalyticsHandler };
