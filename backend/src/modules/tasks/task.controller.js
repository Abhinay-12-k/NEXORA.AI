const asyncHandler = require('express-async-handler');
const taskService = require('./task.service');
const { logActivity } = require('../activity/activity.controller');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasks(req.user.id, req.user.role);
    res.status(200).json(tasks);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    res.status(200).json(task);
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private (Mentor/Admin)
const createTask = asyncHandler(async (req, res) => {
    if (req.user.role === 'intern') {
        res.status(401);
        throw new Error('Interns cannot create tasks');
    }

    const { title, description, assignedTo, difficulty, deadline } = req.body;

    if (!title || !description || !assignedTo || !deadline) {
        res.status(400);
        throw new Error('Please add all mandatory fields');
    }

    const task = await taskService.createTask({
        title, description, assignedTo, difficulty, deadline
    }, req.user.id);

    await logActivity(req.user.id, req.user.role, 'task_created', 'Task', task._id);

    res.status(201).json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
    );
    res.status(200).json(task);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Mentor/Admin)
const deleteTask = asyncHandler(async (req, res) => {
    const result = await taskService.deleteTask(
        req.params.id,
        req.user.id,
        req.user.role
    );
    res.status(200).json(result);
});

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
