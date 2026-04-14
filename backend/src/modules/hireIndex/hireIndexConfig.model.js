const mongoose = require('mongoose');

const hireIndexConfigSchema = mongoose.Schema({
    taskCompletionWeight: {
        type: Number,
        default: 0.25
    },
    deadlineWeight: {
        type: Number,
        default: 0.15
    },
    mentorWeight: {
        type: Number,
        default: 0.20
    },
    codeQualityWeight: {
        type: Number,
        default: 0.20
    },
    githubWeight: {
        type: Number,
        default: 0.10
    },
    communicationWeight: {
        type: Number,
        default: 0.10
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HireIndexConfig', hireIndexConfigSchema);
