const OpenAI = require('openai');
const asyncHandler = require('express-async-handler');
const ActivityLog = require('../activity/activityLog.model');
const Task = require('../tasks/task.model');
const Submission = require('../tasks/submission.model');
const Intern = require('../users/intern.model');

// Configuration for Groq (OpenAI-compatible)
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// @desc    Generate AI Feedback for an intern
// @route   POST /api/ai-feedback/:internId
// @access  Private (Admin/Mentor)
const generateFeedback = asyncHandler(async (req, res) => {
    const internId = req.params.internId;

    if (!internId) {
        res.status(400);
        throw new Error('Intern ID is required');
    }

    // Check if Groq API key is configured and not a placeholder
    const PLACEHOLDER_KEY = 'your_groq_api_key_here';
    const useMockFallback = !process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === PLACEHOLDER_KEY;

    try {
        // Fetch Performance Data for the intern
        const intern = await Intern.findOne({ user: internId });
        const allTasks = await Task.find({ assignedTo: internId });
        const subs = await Submission.find({ internId }).populate('taskId', 'title');

        const totalTasksCount = intern ? intern.totalTasksAssigned : allTasks.length;
        const completedTasksCount = intern ? intern.totalTasksCompleted : subs.filter(s => s.status === 'approved').length;

        // Completion Rate
        const completionRate = totalTasksCount === 0 ? 0 : (completedTasksCount / totalTasksCount) * 100;

        // Average Feedback Score
        const averageFeedbackScore = intern ? (intern.mentorRatingAverage * 2) : 0; // Scale 1-5 to 1-10

        // Deadline Discipline
        const deadlineDiscipline = completedTasksCount === 0 ? 0 : ((intern ? intern.deadlinesMet : 0) / completedTasksCount) * 100;

        const performanceMetrics = {
            totalTasks: totalTasksCount,
            completedTasks: completedTasksCount,
            completionRate: Math.round(completionRate * 10) / 10,
            averageFeedbackScore: Math.round(averageFeedbackScore * 10) / 10,
            deadlineDiscipline: Math.round(deadlineDiscipline * 10) / 10
        };

        const taskHistory = subs.map(s => ({
            title: s.taskId?.title || 'Unknown Task',
            status: s.status,
            score: s.mentorRating ? `${s.mentorRating}/5` : 'N/A',
            comment: s.mentorFeedback || 'No feedback yet'
        }));

        let parsedResponse;

        if (useMockFallback) {
            console.log("Using dynamic Demo Mode fallback for AI Feedback (No valid GROQ_API_KEY found)");

            // Generate dynamic feedback based on actual metrics
            const isHighPerformer = completionRate > 80 && averageFeedbackScore > 8;
            const needsImprovement = completionRate < 50 || deadlineDiscipline < 50;

            parsedResponse = {
                summary: isHighPerformer
                    ? `Exceptional performance with a ${performanceMetrics.completionRate}% completion rate. You consistently deliver high-quality work and maintain excellent deadline discipline.`
                    : needsImprovement
                        ? `Currently showing moderate progress. Focus on improving task completion consistency and managing deadlines more effectively to reach the next tier.`
                        : `Solid performance across assigned tasks. You demonstrate reliable contribution and technical growth, with an average feedback score of ${performanceMetrics.averageFeedbackScore}/10.`,
                strengths: isHighPerformer
                    ? ["Highly consistent delivery", "Excellent technical execution", "Strong time management"]
                    : ["Reliable core contributions", "Proactive task engagement", "Growing technical proficiency"],
                weaknesses: needsImprovement
                    ? ["Inconsistent submission timing", "Task completion volume", "Attention to detailed requirements"]
                    : ["Predictive troubleshooting", "Advanced documentation", "Innovation in task approach"],
                roadmap: isHighPerformer
                    ? ["Leadership in complex assignments", "Advanced architectural design", "Cross-team collaboration projects"]
                    : ["Mastery of core module logic", "Improving delivery speed by 20%", "Unit testing best practices"],
                isDemoMode: true
            };
        } else {
            const prompt = `
            You are an expert internship mentor. Analyze the following intern performance data and provide a constructive feedback report in JSON format.

            Performance Metrics:
            ${JSON.stringify(performanceMetrics, null, 2)}

            Task History (last few tasks):
            ${JSON.stringify(taskHistory.slice(-5), null, 2)}

            Requirement:
            Provide a JSON response with these exact fields:
            - summary: A professional 3-sentence summary (string)
            - strengths: An array of 3 strengths (array of strings)
            - weaknesses: An array of 3 weaknesses (array of strings)
            - roadmap: An array of 3 learning goals (array of strings)

            CRITICAL SCHEMA RULES:
            1. NO NESTED OBJECTS. Every value must be a plain STRING.
            2. Use ONLY the 4 keys listed above.
            3. Return ONLY strings in arrays.

            Return only the JSON object. No other text.
            `;

            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: "You are a professional mentor providing data-driven internship performance analysis in strict JSON format." },
                        { role: "user", content: prompt }
                    ],
                    model: "llama-3.1-8b-instant",
                    response_format: { type: "json_object" }
                });

                const aiResponse = completion.choices[0].message.content;
                parsedResponse = JSON.parse(aiResponse);
            } catch (error) {
                // Nested fallback if Groq fails at runtime (e.g. rate limit/auth)
                if (error.status === 401 || error.code === 'invalid_api_key' || error.status === 429) {
                    console.error("Groq API failed, falling back to Demo Mode:", error.message);
                    // Use the same fallback logic as above
                    parsedResponse = {
                        summary: `[Demo Mode] Currently showing steady progress with a ${performanceMetrics.completionRate}% completion rate. Direct feedback indicates solid technical potential.`,
                        strengths: ["Technical task execution", "Application of feedback", "Consistency"],
                        weaknesses: ["Complex problem decomposition", "Proactive optimization", "Time estimation"],
                        roadmap: ["Focus on scalable code patterns", "Enhance testing coverage", "Master advanced framework features"],
                        isDemoMode: true
                    };
                } else {
                    throw error;
                }
            }
        }

        // --- ULTIMATE BACKEND SANITIZATION ---
        const flattenToString = (val) => {
            if (val === null || val === undefined) return "";
            if (typeof val === 'string') return val;
            if (typeof val !== 'object') return String(val);
            const values = Object.values(val).map(v => (typeof v === 'object' ? JSON.stringify(v) : v));
            return values.join(". ");
        };

        parsedResponse.summary = flattenToString(parsedResponse.summary);
        const sanitizeArray = (arr) => {
            if (!Array.isArray(arr)) return ["Information pending more task data"];
            return arr.map(item => flattenToString(item));
        };

        parsedResponse.strengths = sanitizeArray(parsedResponse.strengths);
        parsedResponse.weaknesses = sanitizeArray(parsedResponse.weaknesses);
        parsedResponse.roadmap = sanitizeArray(parsedResponse.roadmap);

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: 'generated',
            entity: 'AI Feedback',
            role: req.user.role
        });

        res.status(200).json(parsedResponse);

    } catch (error) {
        console.error("AI Coach Error:", error.message);
        res.status(500);
        throw new Error(error.message || 'AI Service failed. Please try again.');
    }
});

module.exports = {
    generateFeedback
};
