const express = require('express');
const router = express.Router();
const { evaluatePerformance } = require('./aiCoach.controller');
const { protect } = require('../../middleware/authMiddleware');

// Restrict to intern role
const internOnly = (req, res, next) => {
    if (req.user && req.user.role === 'intern') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. AI Coach is only for interns.');
    }
};

router.post('/evaluate', protect, internOnly, evaluatePerformance);

module.exports = router;
