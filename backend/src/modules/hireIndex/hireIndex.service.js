const Submission = require('../tasks/submission.model');
const Intern = require('../users/intern.model');
const Task = require('../tasks/task.model');
const HireIndexConfig = require('./hireIndexConfig.model');
const OpenAI = require('openai');

/**
 * Service to handle Nexora HireIndex™ calculations and reports.
 */
class HireIndexService {
    constructor() {
        this.groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });
    }

    /**
     * Calculate and save HireIndex for an intern.
     * @param {string} internUserId - The User ID of the intern.
     */
    async calculateHireIndex(internUserId) {
        // 1. Fetch metrics from DB (Tasks & Submissions)
        const tasks = await Task.find({ assignedTo: internUserId });
        const submissions = await Submission.find({ internId: internUserId, status: 'approved' }).populate('taskId');

        const totalTasksAssigned = tasks.length;
        const totalTasksCompleted = submissions.length; // Counting approved submissions as completion

        let totalDeadlinesMet = 0;
        let totalMentorRating = 0;
        let totalGithubScore = 0;
        let totalCodeQualityScore = 0;
        let totalCommunicationScore = 0;
        let ratedTasksCount = 0;

        submissions.forEach(sub => {
            // Deadline check (Submissions link to Task via taskId)
            if (sub.submittedAt && sub.taskId?.deadline && new Date(sub.submittedAt) <= new Date(sub.taskId.deadline)) {
                totalDeadlinesMet++;
            }
            if (sub.mentorRating !== undefined && sub.mentorRating !== null) {
                totalMentorRating += sub.mentorRating;
                totalGithubScore += (sub.githubScore || 0);
                totalCodeQualityScore += (sub.codeQualityScore || 0);
                totalCommunicationScore += (sub.communicationScore || 0);
                ratedTasksCount++;
            }
        });

        const deadlinesMissed = totalTasksCompleted - totalDeadlinesMet;

        // Averages (out of their respective scales)
        const mentorRatingAverage = ratedTasksCount === 0 ? 0 : (totalMentorRating / ratedTasksCount);
        const averageGithubMark = ratedTasksCount === 0 ? 0 : (totalGithubScore / ratedTasksCount);
        const averageCodeQualityMark = ratedTasksCount === 0 ? 0 : (totalCodeQualityScore / ratedTasksCount);
        const averageCommMark = ratedTasksCount === 0 ? 0 : (totalCommunicationScore / ratedTasksCount);

        // Normalized to 100%
        const mentorRatingPercent = (mentorRatingAverage / 5) * 100;
        const codeQualityPercent = averageCodeQualityMark * 10; // 0-10 -> 0-100
        const githubPercent = averageGithubMark * 10; // 0-10 -> 0-100
        const communicationPercent = averageCommMark * 10; // 0-10 -> 0-100

        // Task & Deadline normalization
        const taskCompletionStatus = totalTasksAssigned === 0 ? 0 : (totalTasksCompleted / totalTasksAssigned) * 100;
        const deadlineConsistency = totalTasksCompleted === 0 ? 0 : (totalDeadlinesMet / totalTasksCompleted) * 100;

        // 3. Get weights from config or defaults
        let config = await HireIndexConfig.findOne({ isActive: true });
        if (!config) {
            config = {
                taskCompletionWeight: 0.25,
                deadlineWeight: 0.15,
                mentorWeight: 0.20,
                codeQualityWeight: 0.20,
                githubWeight: 0.10,
                communicationWeight: 0.10
            };
        }

        // 4. Calculate Final HireIndex
        const hireIndexScore = (
            (taskCompletionStatus * config.taskCompletionWeight) +
            (deadlineConsistency * config.deadlineWeight) +
            (mentorRatingPercent * config.mentorWeight) +
            (codeQualityPercent * config.codeQualityWeight) +
            (githubPercent * config.githubWeight) +
            (communicationPercent * config.communicationWeight)
        );

        const roundedScore = parseFloat(hireIndexScore.toFixed(1));

        // 5. Determine Status
        let hireIndexStatus = 'High Risk';
        if (roundedScore >= 85) hireIndexStatus = 'Ready for Full-Time Conversion';
        else if (roundedScore >= 70) hireIndexStatus = 'On Track';
        else if (roundedScore >= 50) hireIndexStatus = 'Needs Improvement';

        // 6. Generate Gap Analysis
        const gapAnalysis = this._generateGapAnalysis({
            taskCompletionStatus,
            deadlineConsistency,
            mentorRatingPercent,
            codeQualityScore: codeQualityPercent,
            normalizedGithub: githubPercent,
            communicationScore: communicationPercent
        });

        // 7. Get AI Explanation
        const aiExplanation = await this._generateAIExplanation(roundedScore, hireIndexStatus, gapAnalysis);

        // 8. Update/Create Intern Profile
        let intern = await Intern.findOne({ user: internUserId });
        const previousScore = intern ? intern.hireIndexScore : 0;
        const trend = intern ? (roundedScore - previousScore) : 0;

        if (!intern) {
            intern = new Intern({ user: internUserId });
        }

        intern.hireIndexScore = roundedScore;
        intern.hireIndexStatus = hireIndexStatus;
        intern.hireIndexTrend = trend;
        intern.lastEvaluatedAt = new Date();
        intern.lastHireIndexAnalyzedAt = new Date();
        intern.totalTasksAssigned = totalTasksAssigned;
        intern.totalTasksCompleted = totalTasksCompleted;
        intern.deadlinesMet = totalDeadlinesMet;
        intern.deadlinesMissed = deadlinesMissed;

        // Store as normalized 0-100 for consistency in DB
        intern.mentorRatingAverage = mentorRatingAverage;
        intern.codeQualityScore = codeQualityPercent;
        intern.githubCommitCount = githubPercent; // Field is reused for the github score %
        intern.communicationScore = communicationPercent;

        await intern.save();

        return {
            score: roundedScore,
            status: hireIndexStatus,
            trend,
            gapAnalysis,
            aiExplanation,
            metrics: {
                taskCompletionStatus,
                deadlineConsistency,
                mentorRatingPercent,
                codeQualityScore: codeQualityPercent,
                githubActivity: githubPercent,
                communicationScore: communicationPercent
            }
        };
    }

    /**
     * Get HireIndex report for an intern.
     */
    async getHireIndexReport(internUserId) {
        const intern = await Intern.findOne({ user: internUserId });
        if (!intern) {
            throw new Error('HireIndex not yet analyzed for this intern.');
        }

        const metrics = {
            taskCompletionStatus: (intern.totalTasksCompleted / intern.totalTasksAssigned) * 100 || 0,
            deadlineConsistency: (intern.deadlinesMet / intern.totalTasksCompleted) * 100 || 0,
            mentorRatingPercent: intern.mentorRatingAverage * 20, // 0-5 -> 0-100
            codeQualityScore: intern.codeQualityScore,
            githubActivity: intern.githubCommitCount,
            communicationScore: intern.communicationScore
        };

        const gapAnalysis = this._generateGapAnalysis(metrics);
        const aiExplanation = await this._generateAIExplanation(intern.hireIndexScore, intern.hireIndexStatus, gapAnalysis);

        return {
            score: intern.hireIndexScore,
            status: intern.hireIndexStatus,
            trend: intern.hireIndexTrend,
            lastAnalyzed: intern.lastHireIndexAnalyzedAt,
            metrics,
            gapAnalysis,
            aiExplanation
        };
    }

    _generateGapAnalysis(metrics) {
        const suggestions = [];
        if (metrics.taskCompletionStatus < 80) {
            suggestions.push({
                metric: 'Task Completion',
                suggestion: 'Aim to complete all assigned tasks to build a consistent track record.'
            });
        }
        if (metrics.deadlineConsistency < 80) {
            suggestions.push({
                metric: 'Deadline Consistency',
                suggestion: 'Focus on improving time management to meet deadlines reliably.'
            });
        }
        if (metrics.mentorRatingPercent < 80) {
            suggestions.push({
                metric: 'Mentor Rating',
                suggestion: 'Request proactive feedback and iterate on task improvements to boost mentor satisfaction.'
            });
        }
        if (metrics.githubActivity < 80) {
            suggestions.push({
                metric: 'GitHub Activity',
                suggestion: 'Increase repository contributions and maintain a healthy commit history.'
            });
        }
        if (metrics.codeQualityScore < 80) {
            suggestions.push({
                metric: 'Code Quality',
                suggestion: 'Follow best practices and focus on code modularity and documentation.'
            });
        }
        if (metrics.communicationScore < 80) {
            suggestions.push({
                metric: 'Communication',
                suggestion: 'Engage more frequently in team discussions and update progress regularly.'
            });
        }
        return suggestions;
    }

    async _generateAIExplanation(score, status, gapAnalysis) {
        const PLACEHOLDER_KEY = 'your_groq_api_key_here';
        const useMock = !process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === PLACEHOLDER_KEY;

        if (useMock) {
            const suggestionsText = gapAnalysis.length > 0
                ? `Improving ${gapAnalysis[0].metric.toLowerCase()} and ${gapAnalysis[1]?.metric.toLowerCase() || 'technical skills'} could significantly enhance your readiness.`
                : "You are performing exceptionally well across all metrics.";

            return `Your HireIndex score is ${score}%. You are currently ${status}. ${suggestionsText}`;
        }

        try {
            const prompt = `
            Analyze the following HireIndex data:
            Score: ${score}%
            Status: ${status}
            Gaps: ${gapAnalysis.map(g => g.metric).join(', ')}

            Provide a professional and encouraging natural language explanation (max 3 sentences).
            Format it like: "Your HireIndex score is [score]%. You are currently [status]. [Specific advice based on gaps]."
            `;

            const completion = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI Explanation Error:', error.message);
            return `Your HireIndex score is ${score}%. You are currently ${status}. Keep working on your core metrics to improve your readiness.`;
        }
    }
}

module.exports = new HireIndexService();
