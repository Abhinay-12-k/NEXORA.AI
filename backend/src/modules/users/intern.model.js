const mongoose = require('mongoose');

const internSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Nexora HireIndex™ Data
    hireIndexScore: {
        type: Number,
        default: 0
    },
    hireIndexStatus: {
        type: String,
        default: 'Pending'
    },
    hireIndexTrend: {
        type: Number,
        default: 0
    },
    lastEvaluatedAt: {
        type: Date
    },
    lastHireIndexAnalyzedAt: {
        type: Date
    },

    // Metrics for calculation
    totalTasksAssigned: {
        type: Number,
        default: 0
    },
    totalTasksCompleted: {
        type: Number,
        default: 0
    },
    deadlinesMet: {
        type: Number,
        default: 0
    },
    deadlinesMissed: {
        type: Number,
        default: 0
    },
    mentorRatingAverage: {
        type: Number,
        default: 0
    },
    codeQualityScore: {
        type: Number,
        default: 0
    },
    githubCommitCount: {
        type: Number,
        default: 0
    },
    communicationScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Intern', internSchema);
