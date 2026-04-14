const Intern = require('../users/intern.model');
const Task = require('../tasks/task.model');

/**
 * Learning Hub Service
 * Performance-to-Skill Intelligence Engine
 * Converts weak HireIndex metrics into structured growth pathways.
 */

// ─── Official Brand Logo URLs ────────────────────────────────────────────────
const LOGOS = {
    leetcode: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png',
    geeksforgeeks: 'https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg',
    git: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png',
    github: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    jira: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg',
    trello: 'https://cdn.worldvectorlogo.com/logos/trello.svg',
    slack: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
    confluence: 'https://cdn.worldvectorlogo.com/logos/confluence-1.svg',
    azure: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
    aws: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    googledocs: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg',
    teams: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg',
    coursera: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg',
    udemy: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg',
};

// ─── Metric → Resource Mapping ───────────────────────────────────────────────
const METRIC_RESOURCE_MAP = {
    githubActivity: {
        label: 'GitHub Activity',
        focusAreas: ['Git Workflows', 'Pull Request Best Practices', 'Version Control Fundamentals'],
        resources: [
            { name: 'Git Official Docs', logo: LOGOS.git, link: 'https://git-scm.com/doc', category: 'Version Control' },
            { name: 'GitHub', logo: LOGOS.github, link: 'https://docs.github.com/en', category: 'Version Control' },
        ],
    },
    codeQualityScore: {
        label: 'Code Quality',
        focusAreas: ['Clean Code Principles', 'Refactoring Techniques', 'Code Review Best Practices'],
        resources: [
            { name: 'GeeksforGeeks – Clean Code', logo: LOGOS.geeksforgeeks, link: 'https://www.geeksforgeeks.org/clean-code-principles/', category: 'Programming' },
        ],
    },
    deadlineConsistency: {
        label: 'Deadline Consistency',
        focusAreas: ['Time Management', 'Agile Basics'],
        resources: [
            { name: 'Jira – Project Management', logo: LOGOS.jira, link: 'https://www.atlassian.com/software/jira/guides', category: 'Project Management' },
            { name: 'Trello – Project Planning', logo: LOGOS.trello, link: 'https://trello.com/guide', category: 'Project Management' },
        ],
    },
    mentorRatingPercent: {
        label: 'Mentor Rating',
        focusAreas: ['Communication Skills', 'Professional Reporting'],
        resources: [
            { name: 'Coursera – Communication', logo: LOGOS.coursera, link: 'https://www.coursera.org/courses?query=communication%20skills', category: 'Communication' },
            { name: 'Udemy – Business Communication', logo: LOGOS.udemy, link: 'https://www.udemy.com/topic/business-communication/', category: 'Communication' },
        ],
    },
    taskCompletionStatus: {
        label: 'Task Completion',
        focusAreas: ['Planning & Execution', 'DevOps Fundamentals'],
        resources: [
            { name: 'Jira – Task Tracking', logo: LOGOS.jira, link: 'https://www.atlassian.com/software/jira/guides', category: 'Project Management' },
            { name: 'Trello – Agile Tasks', logo: LOGOS.trello, link: 'https://trello.com/use-cases/agile', category: 'Project Management' },
        ],
    },
};

// ─── Mandatory Learning Ecosystem Section ─────────────────────────────────────
const MANDATORY_ECOSYSTEM = [
    {
        category: 'Programming & Problem Solving',
        resources: [
            { name: 'LeetCode', logo: LOGOS.leetcode, link: 'https://leetcode.com/', desc: 'Master DSA & algorithms' },
            { name: 'GeeksforGeeks', logo: LOGOS.geeksforgeeks, link: 'https://www.geeksforgeeks.org/', desc: 'CS foundation & tutorials' }
        ]
    },
    {
        category: 'Version Control',
        resources: [
            { name: 'Git', logo: LOGOS.git, link: 'https://git-scm.com/', desc: 'Distributed version control' },
            { name: 'GitHub', logo: LOGOS.github, link: 'https://github.com/', desc: 'Source control & collaboration' }
        ]
    },
    {
        category: 'Project Management',
        resources: [
            { name: 'Jira', logo: LOGOS.jira, link: 'https://www.atlassian.com/software/jira', desc: 'Enterprise agile tracking' },
            { name: 'Trello', logo: LOGOS.trello, link: 'https://trello.com/', desc: 'Visual task management' }
        ]
    },
    {
        category: 'Collaboration',
        resources: [
            { name: 'Microsoft Teams', logo: LOGOS.teams, link: 'https://www.microsoft.com/en-us/microsoft-teams/group-chat-software', desc: 'Professional team communication' },
            { name: 'Slack', logo: LOGOS.slack, link: 'https://slack.com/', desc: 'Real-time team messaging' }
        ]
    },
    {
        category: 'Documentation',
        resources: [
            { name: 'Google Docs', logo: LOGOS.googledocs, link: 'https://docs.google.com/', desc: 'Technical documentation & papers' },
            { name: 'Confluence', logo: LOGOS.confluence, link: 'https://www.atlassian.com/software/confluence', desc: 'Internal knowledge base' }
        ]
    },
    {
        category: 'Communication & Courses',
        resources: [
            { name: 'Coursera', logo: LOGOS.coursera, link: 'https://www.coursera.org/', desc: 'Industry certifications & degrees' },
            { name: 'Udemy', logo: LOGOS.udemy, link: 'https://www.udemy.com/', desc: 'Skill-specific technical courses' }
        ]
    },
    {
        category: 'Cloud Platforms & Certifications',
        resources: [
            { name: 'AWS Cloud Practitioner', logo: LOGOS.aws, link: 'https://aws.amazon.com/certification/certified-cloud-practitioner/', desc: 'Official AWS Certification Path' },
            { name: 'Azure Fundamentals', logo: LOGOS.azure, link: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/', desc: 'Official Microsoft Azure Path' }
        ]
    }
];

// ─── Company Required Skills Configuration (Single-Tenant) ───────────────────
const COMPANY_SKILLS = [
    { skill: 'Java Full Stack', level: 'Moderate', metricKeys: ['codeQualityScore', 'taskCompletionStatus'] },
    { skill: 'Strong Technical Skills', level: 'Strong', metricKeys: ['codeQualityScore', 'githubActivity'] },
    { skill: 'Strong Soft Skills', level: 'Strong', metricKeys: ['communicationScore', 'mentorRatingPercent'] },
    { skill: 'DSA', level: 'Strong', metricKeys: ['codeQualityScore'] },
    { skill: 'Strong Problem Solving', level: 'Strong', metricKeys: ['taskCompletionStatus', 'deadlineConsistency'] },
    { skill: 'Basic DevOps', level: 'Moderate', metricKeys: ['githubActivity'] },
    { skill: 'Cloud Services Awareness', level: 'Moderate', metricKeys: ['codeQualityScore'] },
];

const HIRE_INDEX_THRESHOLD = 85;

class LearningHubService {
    /**
     * Get fertilisers learning hub data for an intern.
     * @param {string} internUserId - The User._id of the logged-in intern.
     */
    async getLearningHubData(internUserId) {
        // 1. Fetch real HireIndex metrics
        const intern = await Intern.findOne({ user: internUserId });
        if (!intern) {
            throw new Error('HireIndex data not available. Please run HireIndex analysis first.');
        }

        // Re-derive the normalised metrics
        const taskCompletionStatus = intern.totalTasksAssigned === 0
            ? 0
            : (intern.totalTasksCompleted / intern.totalTasksAssigned) * 100;
        const deadlineConsistency = intern.totalTasksCompleted === 0
            ? 0
            : (intern.deadlinesMet / intern.totalTasksCompleted) * 100;
        const mentorRatingPercent = (intern.mentorRatingAverage || 0) * 10;
        const codeQualityScore = intern.codeQualityScore || 0;
        const githubActivity = Math.min(((intern.githubCommitCount || 0) / 20) * 100, 100);
        const communicationScore = intern.communicationScore || 0;

        const metrics = {
            taskCompletionStatus,
            deadlineConsistency,
            mentorRatingPercent,
            codeQualityScore,
            githubActivity,
            communicationScore,
        };

        // 2. Identify weakest 2–3 metrics (below 80%)
        const metricEntries = Object.entries(metrics)
            .filter(([key]) => METRIC_RESOURCE_MAP[key]) // Only metrics we have mapping for
            .map(([key, value]) => ({
                key,
                label: METRIC_RESOURCE_MAP[key].label,
                score: parseFloat(value.toFixed(1)),
            }))
            .sort((a, b) => a.score - b.score);

        const weakestMetrics = metricEntries.filter(m => m.score < 80).slice(0, 3);

        // 3. Build recommendations from mapping
        const recommendations = weakestMetrics.map(wm => {
            const mapping = METRIC_RESOURCE_MAP[wm.key];
            return {
                metric: wm.label,
                score: wm.score,
                focusAreas: mapping?.focusAreas || [],
                resources: mapping?.resources || [],
            };
        });

        // 4. Evaluate company skill alignment
        const companySkills = COMPANY_SKILLS.map(cs => {
            const relevantScores = cs.metricKeys.map(k => metrics[k] || 0);
            const avg = relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length;

            let status = 'Weak';
            if (avg >= 85) status = 'Strong';
            else if (avg >= 65) status = 'Moderate';

            return {
                skill: cs.skill,
                requiredLevel: cs.level,
                currentStatus: status,
                averageScore: parseFloat(avg.toFixed(1)),
            };
        });

        return {
            currentScore: intern.hireIndexScore || 0,
            threshold: HIRE_INDEX_THRESHOLD,
            weakestMetrics,
            recommendations,
            companySkills,
            mandatoryEcosystem: MANDATORY_ECOSYSTEM
        };
    }
}

module.exports = new LearningHubService();
