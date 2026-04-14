const User = require('../users/user.model');
const Intern = require('../users/intern.model');
const mongoose = require('mongoose');

/**
 * Fetch paginated leaderboard data sorted by hireIndexScore descending.
 * Includes ALL interns by starting from the User model.
 * Rank is calculated as absolute position in the full list.
 *
 * @param {number} page  - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} { total, page, totalPages, data }
 */
const getLeaderboard = async (page, limit) => {
    const skip = (page - 1) * limit;

    // Aggregation pipeline starting from User to include all interns
    const pipeline = [
        {
            $match: {
                role: 'intern'
            }
        },
        {
            $lookup: {
                from: 'interns', // MongoDB collection name for Intern model
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
                hireIndexStatus: { $ifNull: ['$internData.hireIndexStatus', 'Pending'] }
            }
        }
    ];

    // Get total count for pagination
    const countResult = await User.aggregate([
        ...pipeline,
        { $count: 'total' }
    ]);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Get paginated data
    const interns = await User.aggregate([
        ...pipeline,
        { $sort: { hireIndexScore: -1, name: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                _id: { $ifNull: ['$internData._id', '$_id'] },
                userId: '$_id',
                name: 1,
                email: 1,
                hireIndexScore: 1,
                hireIndexStatus: 1
            }
        }
    ]);

    // Map to response shape
    const data = interns.map((intern, index) => ({
        _id: intern._id,
        userId: intern.userId,
        name: intern.name || 'Unknown Intern',
        email: intern.email || '',
        hireIndexScore: intern.hireIndexScore,
        hireIndexStatus: intern.hireIndexStatus,
        rank: skip + index + 1,
    }));

    return {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data,
    };
};

module.exports = { getLeaderboard };
