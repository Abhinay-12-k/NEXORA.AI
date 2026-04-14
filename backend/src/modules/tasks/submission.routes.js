const express = require('express');
const router = express.Router();
const {
    getSubmissions,
    reviewSubmission
} = require('./submission.controller');
const { protect } = require('../../middleware/authMiddleware');

router.route('/')
    .get(protect, getSubmissions);

router.patch('/:id/review', protect, reviewSubmission);

module.exports = router;
