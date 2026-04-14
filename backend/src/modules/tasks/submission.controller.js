const asyncHandler = require('express-async-handler');
const submissionService = require('./submission.service');

// @desc    Submit task
// @route   POST /api/tasks/:id/submit
// @access  Private (Intern)
const submitTask = asyncHandler(async (req, res) => {
    if (req.user.role !== 'intern') {
        res.status(401);
        throw new Error('Only interns can submit tasks');
    }

    const submission = await submissionService.submitTask(
        req.params.id,
        req.user.id,
        req.body
    );

    res.status(201).json(submission);
});

// @desc    Get submissions
// @route   GET /api/submissions (or /api/mentor/submissions based on user role)
// @access  Private
const getSubmissions = asyncHandler(async (req, res) => {
    console.log('DEBUG: getSubmissions hit by user:', req.user.id);
    const submissions = await submissionService.getSubmissions(req.user.id, req.user.role);
    res.status(200).json(submissions);
});

// @desc    Review submission
// @route   PATCH /api/submissions/:id/review
// @access  Private (Mentor)
const reviewSubmission = asyncHandler(async (req, res) => {
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to review submissions');
    }

    const submission = await submissionService.reviewSubmission(
        req.params.id,
        req.user.id,
        req.body
    );

    res.status(200).json(submission);
});

module.exports = {
    submitTask,
    getSubmissions,
    reviewSubmission
};
