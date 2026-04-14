const express = require('express');
const router = express.Router();
const {
    analyzeHireIndex,
    getHireIndexReport,
    getTopPerformers,
    getAdminStats
} = require('./hireIndex.controller');
const { protect } = require('../../middleware/authMiddleware');

// Manual Trigger for HireIndex Analysis
router.post('/analyze', protect, analyzeHireIndex);

// Get individual report
router.get('/report', protect, getHireIndexReport);

// Admin/Mentor overall top performers
router.get('/top', protect, getTopPerformers);

// Admin stats for dashboard
router.get('/stats', protect, getAdminStats);

module.exports = router;
