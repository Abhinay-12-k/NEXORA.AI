const asyncHandler = require('express-async-handler');
const learningHubService = require('./learningHub.service');

/**
 * @desc    Get personalised Learning Hub data for the logged-in intern
 * @route   GET /api/learning-hub
 * @access  Intern only (protected)
 */
const getLearningHub = asyncHandler(async (req, res) => {
    const data = await learningHubService.getLearningHubData(req.user._id);
    res.json(data);
});

module.exports = { getLearningHub };
