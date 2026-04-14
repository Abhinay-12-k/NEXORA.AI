const Intern = require('../users/intern.model');
const User = require('../users/user.model');

/**
 * Hiring Analytics Service
 * Provides company-level insights about internship-to-full-time conversion readiness.
 * STARTS from User model to ensure ALL interns are included.
 */

const getHiringAnalytics = async () => {
    // ── 1. Base pipeline: Start from Users, filter by role = 'intern', join with Intern ──
    const basePipeline = [
        {
            $match: {
                role: 'intern'
            }
        },
        {
            $lookup: {
                from: 'interns',
                localField: '_id',
                foreignField: 'user',
                as: 'internData'
            }
        },
        {
            $unwind: {
                path: '$internData',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                hireIndexScore: { $ifNull: ['$internData.hireIndexScore', 0] },
                totalTasksAssigned: { $ifNull: ['$internData.totalTasksAssigned', 0] },
                totalTasksCompleted: { $ifNull: ['$internData.totalTasksCompleted', 0] },
                deadlinesMet: { $ifNull: ['$internData.deadlinesMet', 0] },
                mentorRatingAverage: { $ifNull: ['$internData.mentorRatingAverage', 0] },
                codeQualityScore: { $ifNull: ['$internData.codeQualityScore', 0] },
                githubCommitCount: { $ifNull: ['$internData.githubCommitCount', 0] },
                communicationScore: { $ifNull: ['$internData.communicationScore', 0] },
                lastHireIndexAnalyzedAt: '$internData.lastHireIndexAnalyzedAt'
            }
        }
    ];

    // ── 2. Overview Summary ────────────────────────────────────────────────────
    const overviewPipeline = [
        ...basePipeline,
        {
            $group: {
                _id: null,
                totalInterns: { $sum: 1 },
                readyCount: {
                    $sum: { $cond: [{ $gte: ['$hireIndexScore', 85] }, 1, 0] }
                },
                onTrackCount: {
                    $sum: {
                        $cond: [
                            { $and: [{ $gte: ['$hireIndexScore', 70] }, { $lt: ['$hireIndexScore', 85] }] },
                            1, 0
                        ]
                    }
                },
                needsImprovementCount: {
                    $sum: {
                        $cond: [
                            { $and: [{ $gte: ['$hireIndexScore', 50] }, { $lt: ['$hireIndexScore', 70] }] },
                            1, 0
                        ]
                    }
                },
                highRiskCount: {
                    $sum: { $cond: [{ $lt: ['$hireIndexScore', 50] }, 1, 0] }
                },
                averageHireIndex: { $avg: '$hireIndexScore' }
            }
        },
        {
            $project: {
                _id: 0,
                totalInterns: 1,
                readyCount: 1,
                onTrackCount: 1,
                needsImprovementCount: 1,
                highRiskCount: 1,
                averageHireIndex: { $round: ['$averageHireIndex', 2] }
            }
        }
    ];

    const overviewResult = await User.aggregate(overviewPipeline);
    const overview = overviewResult[0] || {
        totalInterns: 0,
        readyCount: 0,
        onTrackCount: 0,
        needsImprovementCount: 0,
        highRiskCount: 0,
        averageHireIndex: 0
    };

    // ── 3. Hiring Funnel ───────────────────────────────────────────────────────
    const funnel = {
        total: overview.totalInterns,
        onTrack: overview.onTrackCount + overview.readyCount,
        ready: overview.readyCount,
        converted: 0
    };

    // ── 4. Score Distribution ──────────────────────────────────────────────────
    const distributionPipeline = [
        ...basePipeline,
        {
            $group: {
                _id: null,
                range85to100: {
                    $sum: { $cond: [{ $gte: ['$hireIndexScore', 85] }, 1, 0] }
                },
                range70to84: {
                    $sum: {
                        $cond: [
                            { $and: [{ $gte: ['$hireIndexScore', 70] }, { $lt: ['$hireIndexScore', 85] }] },
                            1, 0
                        ]
                    }
                },
                range50to69: {
                    $sum: {
                        $cond: [
                            { $and: [{ $gte: ['$hireIndexScore', 50] }, { $lt: ['$hireIndexScore', 70] }] },
                            1, 0
                        ]
                    }
                },
                below50: {
                    $sum: { $cond: [{ $lt: ['$hireIndexScore', 50] }, 1, 0] }
                }
            }
        },
        { $project: { _id: 0 } }
    ];

    const distributionResult = await User.aggregate(distributionPipeline);
    const distribution = distributionResult[0] || {
        range85to100: 0,
        range70to84: 0,
        range50to69: 0,
        below50: 0
    };

    // ── 5. Average Metrics Breakdown ───────────────────────────────────────────
    const averagesPipeline = [
        ...basePipeline,
        {
            $group: {
                _id: null,
                taskCompletion: {
                    $avg: {
                        $cond: [
                            { $gt: ['$totalTasksAssigned', 0] },
                            { $multiply: [{ $divide: ['$totalTasksCompleted', '$totalTasksAssigned'] }, 100] },
                            0
                        ]
                    }
                },
                deadlineConsistency: {
                    $avg: {
                        $cond: [
                            { $gt: ['$totalTasksCompleted', 0] },
                            { $multiply: [{ $divide: ['$deadlinesMet', '$totalTasksCompleted'] }, 100] },
                            0
                        ]
                    }
                },
                mentorRating: { $avg: { $multiply: ['$mentorRatingAverage', 10] } },
                codeQuality: { $avg: '$codeQualityScore' },
                githubActivity: {
                    $avg: { $min: [{ $multiply: [{ $divide: ['$githubCommitCount', 20] }, 100] }, 100] }
                },
                communication: { $avg: '$communicationScore' }
            }
        },
        {
            $project: {
                _id: 0,
                taskCompletion: { $round: ['$taskCompletion', 1] },
                deadlineConsistency: { $round: ['$deadlineConsistency', 1] },
                mentorRating: { $round: ['$mentorRating', 1] },
                codeQuality: { $round: ['$codeQuality', 1] },
                githubActivity: { $round: ['$githubActivity', 1] },
                communication: { $round: ['$communication', 1] }
            }
        }
    ];

    const averagesResult = await User.aggregate(averagesPipeline);
    const averages = averagesResult[0] || {
        taskCompletion: 0,
        deadlineConsistency: 0,
        mentorRating: 0,
        codeQuality: 0,
        githubActivity: 0,
        communication: 0
    };

    // ── 6. Monthly Trend Analytics ─────────────────────────────────────────────
    const monthlyTrendPipeline = [
        ...basePipeline,
        { $match: { lastHireIndexAnalyzedAt: { $exists: true, $ne: null } } },
        {
            $group: {
                _id: {
                    year: { $year: '$lastHireIndexAnalyzedAt' },
                    month: { $month: '$lastHireIndexAnalyzedAt' }
                },
                averageHireIndex: { $avg: '$hireIndexScore' },
                totalAnalyzed: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
            $project: {
                _id: 0,
                month: {
                    $concat: [
                        { $toString: '$_id.year' },
                        '-',
                        {
                            $cond: [
                                { $lt: ['$_id.month', 10] },
                                { $concat: ['0', { $toString: '$_id.month' }] },
                                { $toString: '$_id.month' }
                            ]
                        }
                    ]
                },
                averageHireIndex: { $round: ['$averageHireIndex', 2] },
                totalAnalyzed: 1
            }
        }
    ];

    const monthlyTrend = await User.aggregate(monthlyTrendPipeline);

    return {
        overview,
        funnel,
        distribution,
        averages,
        monthlyTrend
    };
};

module.exports = { getHiringAnalytics };
