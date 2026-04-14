const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    },
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    githubLink: {
        type: String
    },
    liveLink: {
        type: String
    },
    documentLink: {
        type: String
    },
    notes: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    mentorFeedback: {
        type: String
    },
    mentorRating: {
        type: Number,
        min: 1,
        max: 5
    },
    githubScore: {
        type: Number,
        min: 0,
        max: 10
    },
    codeQualityScore: {
        type: Number,
        min: 0,
        max: 10
    },
    communicationScore: {
        type: Number,
        min: 0,
        max: 10
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
