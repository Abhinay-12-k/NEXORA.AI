const express = require('express');
const router = express.Router();
const {
    exportInternPdf,
    exportSystemCsv,
    exportSystemPdf,
    exportLeaderboard,
    exportLeaderboardPdf
} = require('./export.controller');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

router.get('/intern/:id/pdf', protect, exportInternPdf);
router.get('/system/csv', protect, adminOnly, exportSystemCsv);
router.get('/system/pdf', protect, adminOnly, exportSystemPdf);
router.get('/leaderboard', protect, exportLeaderboard);
router.get('/leaderboard/pdf', protect, exportLeaderboardPdf);

module.exports = router;
