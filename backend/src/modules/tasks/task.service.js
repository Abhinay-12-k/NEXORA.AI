const Task = require('./task.model');

class TaskService {
    async getTasks(userId, role) {
        if (role === 'admin') {
            return await Task.find()
                .populate('assignedTo', 'name email')
                .populate('createdBy', 'name email');
        } else if (role === 'mentor') {
            return await Task.find({ createdBy: userId })
                .populate('assignedTo', 'name email');
        } else {
            return await Task.find({ assignedTo: userId })
                .populate('createdBy', 'name email');
        }
    }

    async getTaskById(taskId) {
        return await Task.findById(taskId)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
    }

    async createTask(taskData, mentorId) {
        return await Task.create({
            ...taskData,
            createdBy: mentorId
        });
    }

    async updateTask(taskId, updateData, userId, role) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');

        // Authorization check
        if (role === 'mentor' && task.createdBy.toString() !== userId) {
            throw new Error('Not authorized to update this task');
        }

        Object.assign(task, updateData);
        return await task.save();
    }

    async deleteTask(taskId, userId, role) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');

        if (role === 'mentor' && task.createdBy.toString() !== userId) {
            throw new Error('Not authorized to delete this task');
        }

        await task.deleteOne();
        return { id: taskId };
    }
}

module.exports = new TaskService();
