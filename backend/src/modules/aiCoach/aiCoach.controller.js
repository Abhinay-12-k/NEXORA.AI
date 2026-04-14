const asyncHandler = require('express-async-handler');
const aiCoachService = require('./aiCoach.service');

/**
 * @desc    Evaluate intern performance using AI Coach
 * @route   POST /api/ai-coach/evaluate
 * @access  Private (Intern only)
 */
const evaluatePerformance = asyncHandler(async (req, res) => {
    const { actionType } = req.body;
    const internUserId = req.user._id;

    if (!['analyze', 'plan', 'readiness'].includes(actionType)) {
        res.status(400);
        throw new Error('Invalid action type. Must be analyze, plan, or readiness.');
    }

    const aiResponse = await aiCoachService.evaluatePerformance(internUserId, actionType);

    res.status(200).json({
        success: true,
        data: aiResponse
    });
});

module.exports = {
    evaluatePerformance
};
