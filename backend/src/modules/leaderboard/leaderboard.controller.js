const asyncHandler = require('express-async-handler');
const { getLeaderboard } = require('./leaderboard.service');

/**
 * @desc    Get paginated leaderboard sorted by hireIndexScore (desc)
 * @route   GET /api/leaderboard?page=1&limit=10
 * @access  Private (All roles)
 */
const getLeaderboardHandler = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const result = await getLeaderboard(page, limit);

    res.status(200).json({
        success: true,
        ...result,
    });
});

module.exports = { getLeaderboardHandler };
