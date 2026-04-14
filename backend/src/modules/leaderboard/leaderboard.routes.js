const express = require('express');
const router = express.Router();
const { getLeaderboardHandler } = require('./leaderboard.controller');
const { protect } = require('../../middleware/authMiddleware');

// GET /api/leaderboard?page=1&limit=10
router.get('/', protect, getLeaderboardHandler);

module.exports = router;
