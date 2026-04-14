const express = require('express');
const router = express.Router();
const { protect, internOnly } = require('../../middleware/authMiddleware');
const { getLearningHub } = require('./learningHub.controller');

// GET /api/learning-hub — Intern only
router.get('/', protect, internOnly, getLearningHub);

module.exports = router;
