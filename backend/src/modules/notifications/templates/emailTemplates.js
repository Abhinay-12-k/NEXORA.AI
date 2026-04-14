const layout = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f7f9;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px;
    }
    .footer {
      background: #f8fafc;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 20px;
    }
    .highlight {
      color: #3b82f6;
      font-weight: 600;
    }
    .card {
      background: #f1f5f9;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nexora AI</h1>
      <p style="margin: 5px 0 0; opacity: 0.8;">Intelligence Beyond Evaluation</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Nexora AI. All rights reserved.<br>
      Support: support@nexora.ai | Intelligence for the Future of Work
    </div>
  </div>
</body>
</html>
`;

module.exports = {
    welcomeEmail: (data) => layout(`
    <h2>Welcome to Nexora AI, <span class="highlight">${data.name}</span>!</h2>
    <p>We are thrilled to have you join our AI-powered internship ecosystem. Your role is confirmed as: <strong>${data.role}</strong>.</p>
    <p>Nexora AI uses advanced analytics to bridge the gap between internships and career-readiness. Dive into your dashboard to get started.</p>
    <a href="${data.loginLink}" class="button">Go to Dashboard</a>
  `),

    taskAssigned: (data) => layout(`
    <h2>New Task Assigned: <span class="highlight">${data.taskTitle}</span></h2>
    <p>Your mentor has assigned a new challenge for you.</p>
    <div class="card">
      <strong>Task:</strong> ${data.taskTitle}<br>
      <strong>Description:</strong> ${data.description}<br>
      <strong>Deadline:</strong> ${data.deadline}
    </div>
    <p>Please review the details and start working on your submission.</p>
    <a href="${data.submissionLink}" class="button">View Task</a>
  `),

    taskSubmissionIntern: (data) => layout(`
    <h2>Submission Received!</h2>
    <p>Great job on submitting <span class="highlight">${data.taskTitle}</span>.</p>
    <p><strong>Timestamp:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
    <p>Your mentor will review it shortly. You'll receive a notification once it's graded.</p>
    <a href="${data.dashboardLink}" class="button">Back to Dashboard</a>
  `),

    taskSubmissionMentor: (data) => layout(`
    <h2>New Submission Alert</h2>
    <p>An intern has submitted a task for your review.</p>
    <div class="card">
      <strong>Intern:</strong> ${data.internName}<br>
      <strong>Task:</strong> ${data.taskTitle}
    </div>
    <a href="${data.reviewLink}" class="button">Review Submission</a>
  `),

    taskGraded: (data) => layout(`
    <h2>Task Graded: <span class="highlight">${data.taskTitle}</span></h2>
    <p>Your mentor has completed the evaluation of your recent submission.</p>
    <div class="card" style="border-left-color: ${data.score >= 80 ? '#10b981' : '#f59e0b'};">
      <strong>Score:</strong> ${data.score}/100<br>
      <strong>Feedback:</strong> ${data.feedback}<br>
      <strong>New HireIndex:</strong> ${data.hireIndex}%
    </div>
    <p><strong>Improvement Suggestions:</strong><br>${data.suggestions}</p>
    <a href="${data.performanceLink}" class="button">View Performance</a>
  `),

    deadlineReminder: (data) => layout(`
    <h2>Deadline Approaching! ⏳</h2>
    <p>This is a friendly reminder that the deadline for <span class="highlight">${data.taskTitle}</span> is in 24 hours.</p>
    <div class="card" style="border-left-color: #ef4444;">
      <strong>Task:</strong> ${data.taskTitle}<br>
      <strong>Time Remaining:</strong> 24 Hours
    </div>
    <p>Ensure you submit your work on time to maintain your HireIndex score.</p>
    <a href="${data.submissionLink}" class="button">Submit Now</a>
  `),

    weeklySummary: (data) => layout(`
    <h2>Your Weekly Progress Summary</h2>
    <p>Here's how you performed this week at Nexora AI.</p>
    <div class="card">
      - <strong>Tasks Completed:</strong> ${data.tasksCompleted}<br>
      - <strong>Average Score:</strong> ${data.avgScore}%<br>
      - <strong>Missed Deadlines:</strong> ${data.missedDeadlines}<br>
      - <strong>Nexora HireIndex:</strong> <span class="highlight">${data.hireIndex}%</span>
    </div>
    <p><strong>AI Recommendation:</strong><br>${data.aiRecommendation}</p>
    <a href="${data.dashboardLink}" class="button">Full Report</a>
  `),

    readinessAlert: (data) => layout(`
    <h2>${data.isPositive ? 'Career Milestone Reached!' : 'Performance Alert'}</h2>
    <p>${data.message}</p>
    <div class="card">
      <strong>Current Readiness %:</strong> ${data.hireIndex}%<br>
      <strong>Gap Analysis:</strong> ${data.gapAnalysis}
    </div>
    <p><strong>Next Steps:</strong> ${data.nextSteps}</p>
    <a href="${data.careerLink}" class="button">Explore Opportunities</a>
  `),
};
