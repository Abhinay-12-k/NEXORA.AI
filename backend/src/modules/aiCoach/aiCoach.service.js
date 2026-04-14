const Intern = require('../users/intern.model');
const OpenAI = require('openai');

class AICoachService {
    constructor() {
        this.groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });
    }

    async evaluatePerformance(internUserId, actionType) {
        const intern = await Intern.findOne({ user: internUserId }).populate('user', 'name');
        if (!intern) {
            throw new Error('Intern data not found. Please complete your HireIndex analysis first.');
        }

        const metrics = {
            score: intern.hireIndexScore,
            status: intern.hireIndexStatus,
            taskCompletion: intern.totalTasksAssigned > 0 ? (intern.totalTasksCompleted / intern.totalTasksAssigned) * 100 : 0,
            deadlineConsistency: intern.totalTasksCompleted > 0 ? (intern.deadlinesMet / intern.totalTasksCompleted) * 100 : 0,
            mentorRating: intern.mentorRatingAverage * 10, // 0-10 to 0-100
            codeQuality: intern.codeQualityScore,
            githubActivity: Math.min((intern.githubCommitCount / 20) * 100, 100),
            communication: intern.communicationScore
        };

        // Identify weakest metrics
        const metricNames = {
            taskCompletion: 'Task Completion',
            deadlineConsistency: 'Deadline Consistency',
            mentorRating: 'Mentor Satisfaction',
            codeQuality: 'Code Quality',
            githubActivity: 'GitHub Contribution',
            communication: 'Team Communication'
        };

        const sortedMetrics = Object.keys(metricNames)
            .map(key => ({ name: metricNames[key], value: metrics[key] }))
            .sort((a, b) => a.value - b.value);

        const weakest = sortedMetrics.slice(0, 2);

        let systemPrompt = "You are Nexora AI Coach, a professional mentor for software engineering interns. Your goal is to provide concise, actionable, and data-driven advice. Use a supportive yet professional tone.";
        let userPrompt = "";

        switch (actionType) {
            case 'analyze':
                userPrompt = `
                Analyze my performance:
                Current HireIndex Score: ${metrics.score}%
                Status: ${metrics.status}
                Weakest Areas: ${weakest[0].name} (${weakest[0].value}%), ${weakest[1].name} (${weakest[1].value}%)
                Threshold for Full-Time: 85%

                Please explain my score, highlight the impact of my weakest metrics on conversion, and compare my current state to the 85% target. Keep it under 150 words.
                `;
                break;
            case 'plan':
                userPrompt = `
                Generate a 7-day action plan:
                Weakest Areas: ${weakest[0].name} (${weakest[0].value}%), ${weakest[1].name} (${weakest[1].value}%)

                Create a specific improvement plan with 3-5 measurable and practical actions I can take this week to improve these specific areas. Format as a bulleted list. Keep it concise.
                `;
                break;
            case 'readiness':
                const gap = Math.max(0, 85 - metrics.score);
                userPrompt = `
                Full-Time Readiness Advice:
                Current Score: ${metrics.score}%
                Target Score: 85%
                Gap: ${gap}%
                Top Priority: ${weakest[0].name}

                State clearly if I am "Ready" or "Not Ready Yet". Show the gap percentage and suggest the single most important priority to focus on right now. Keep it under 80 words.
                `;
                break;
            default:
                throw new Error('Invalid action type');
        }

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: "llama-3.1-8b-instant",
                max_tokens: 300,
                temperature: 0.7
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI Coach Error:', error.message);
            throw new Error('AI Coach service is temporarily unavailable. Please try again later.');
        }
    }
}

module.exports = new AICoachService();
