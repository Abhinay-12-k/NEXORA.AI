const express = require('express');
const router = express.Router();
const { getHiringAnalyticsHandler } = require('./hiringAnalytics.controller');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

// GET /api/admin/hiring-analytics
router.get('/hiring-analytics', protect, adminOnly, getHiringAnalyticsHandler);

module.exports = router;
