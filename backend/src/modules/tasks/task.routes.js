const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require('./task.controller');
const { submitTask } = require('./submission.controller');
const { protect } = require('../../middleware/authMiddleware');

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.post('/:id/submit', protect, submitTask);

module.exports = router;
