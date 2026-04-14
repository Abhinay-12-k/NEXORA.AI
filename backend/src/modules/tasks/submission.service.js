const Submission = require('./submission.model');
const Task = require('./task.model');
const hireIndexService = require('../hireIndex/hireIndex.service');
const { logActivity } = require('../activity/activity.controller');

class SubmissionService {
    async submitTask(taskId, internId, submissionData) {
        // Prevent duplicate submissions for the same task by same intern
        const existingSubmission = await Submission.findOne({ taskId, internId });
        if (existingSubmission && existingSubmission.status !== 'rejected') {
            throw new Error('Task already submitted or approved');
        }

        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.assignedTo.toString() !== internId) throw new Error('Task not assigned to you');

        const submission = await Submission.create({
            taskId,
            internId,
            ...submissionData,
            status: 'pending'
        });

        // Log activity
        await logActivity(internId, 'intern', 'task_submitted', 'Submission', submission._id);

        return submission;
    }

    async getSubmissions(userId, role) {
        if (role === 'mentor') {
            // Mentor sees submissions for tasks they created
            const tasks = await Task.find({ createdBy: userId }).select('_id');
            const taskIds = tasks.map(t => t._id);
            return await Submission.find({ taskId: { $in: taskIds } })
                .populate('taskId', 'title deadline')
                .populate('internId', 'name email');
        } else if (role === 'intern') {
            return await Submission.find({ internId: userId })
                .populate('taskId', 'title deadline');
        }
        return await Submission.find()
            .populate('taskId', 'title')
            .populate('internId', 'name');
    }

    async reviewSubmission(submissionId, mentorId, reviewData) {
        const submission = await Submission.findById(submissionId).populate('taskId');
        if (!submission) throw new Error('Submission not found');

        // Check if mentor created the original task
        if (submission.taskId.createdBy.toString() !== mentorId) {
            throw new Error('Not authorized to review this submission');
        }

        submission.status = reviewData.status; // 'approved' or 'rejected'
        submission.mentorFeedback = reviewData.mentorFeedback;
        submission.mentorRating = reviewData.mentorRating;
        submission.githubScore = reviewData.githubScore;
        submission.codeQualityScore = reviewData.codeQualityScore;
        submission.communicationScore = reviewData.communicationScore;
        submission.reviewedAt = Date.now();

        await submission.save();

        // If approved, trigger HireIndex recalculation
        if (submission.status === 'approved') {
            await hireIndexService.calculateHireIndex(submission.internId);

            // Also close the task if approved
            const task = await Task.findById(submission.taskId._id);
            task.status = 'closed';
            await task.save();
        }

        // Log activity
        await logActivity(mentorId, 'mentor', `task_${submission.status}`, 'Submission', submission._id);

        return submission;
    }
}

module.exports = new SubmissionService();
