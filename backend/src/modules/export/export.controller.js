const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const Task = require('../tasks/task.model');
const User = require('../users/user.model');
const path = require('path');
const fs = require('fs');

// --- CONSTANTS ---
const COLORS = {
    primary: '#2563EB',
    text: '#1E293B',
    secondary: '#64748B',
    positive: '#16A34A',
    negative: '#DC2626',
    border: '#E2E8F0',
    accent: '#F8FAFC'
};

const LOGO_PATH = path.join(__dirname, '../../../../frontend/public/nexoralogo.png');

// --- HELPERS ---

const calculateOverallScore = (tasks) => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const totalTasksCount = tasks.length;
    const completedTasksCount = completedTasks.length;

    if (totalTasksCount === 0) return 0;

    const completionRate = (completedTasksCount / totalTasksCount) * 100;

    let totalScore = 0;
    let scoredTasksCount = 0;
    completedTasks.forEach(task => {
        if (task.feedbackScore !== undefined && task.feedbackScore !== null) {
            totalScore += task.feedbackScore;
            scoredTasksCount++;
        }
    });
    const averageFeedbackScore = scoredTasksCount === 0 ? 0 : (totalScore / scoredTasksCount);

    let onTimeTasksCount = 0;
    completedTasks.forEach(task => {
        if (task.submittedAt && task.deadline && new Date(task.submittedAt) <= new Date(task.deadline)) {
            onTimeTasksCount++;
        }
    });
    const deadlineDiscipline = completedTasksCount === 0 ? 0 : (onTimeTasksCount / completedTasksCount) * 100;

    const normalizedFeedback = averageFeedbackScore * 10;
    return (completionRate * 0.3) + (normalizedFeedback * 0.4) + (deadlineDiscipline * 0.3);
};

const drawBrandedHeader = (doc, reportTitle) => {
    // Logo
    if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 50, 45, { width: 40 });
    } else {
        doc.fillColor(COLORS.primary).fontSize(20).text('N', 50, 45, { bold: true });
    }

    // Branding
    doc.fillColor(COLORS.primary)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('Nexora AI', 100, 45);

    doc.fillColor(COLORS.secondary)
        .fontSize(10)
        .font('Helvetica')
        .text('Performance Intelligence Platform', 100, 70);

    // Generation Details
    doc.fillColor(COLORS.text)
        .fontSize(9)
        .text(`Generated On: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`, 400, 50, { align: 'right' });

    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 400, 65, { align: 'right' });

    // Divider
    doc.moveTo(50, 100).lineTo(550, 100).strokeColor(COLORS.border).lineWidth(1).stroke();

    doc.x = 50; // Reset X to left margin
    doc.y = 120; // Set Y to after header
};

const drawBrandedFooter = (doc) => {
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);

        doc.moveTo(50, 740).lineTo(550, 740).strokeColor(COLORS.border).lineWidth(1).stroke();

        doc.fillColor(COLORS.secondary)
            .fontSize(8)
            .text('© 2026 Nexora AI - Enterprise Performance Intelligence', 50, 755, { align: 'left' });

        doc.text(`Page ${i + 1} of ${pageCount}`, 500, 755, { align: 'right' });
    }
};

const drawSectionTitle = (doc, title) => {
    doc.moveDown(1);
    doc.fillColor(COLORS.text)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(title, 50, doc.y, { underline: false, align: 'left' });
    doc.moveDown(0.5);
};

// --- CONTROLLERS ---

// @desc    Export individual intern performance report (PDF)
const exportInternPdf = asyncHandler(async (req, res) => {
    const Intern = require('../users/intern.model');
    const internId = req.params.id;
    const user = await User.findById(internId);
    if (!user) {
        res.status(404);
        throw new Error('Intern not found');
    }

    const intern = await Intern.findOne({ user: internId });
    const stats = intern || { hireIndexScore: 0, totalTasksAssigned: 0, totalTasksCompleted: 0, mentorRatingAverage: 0, deadlinesMet: 0 };

    const doc = new PDFDocument({ margin: 50, bufferPages: true });
    const filename = `nexora_report_${user.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);
    drawBrandedHeader(doc, 'Intern Performance Analysis');

    // Profile Card
    const cardY = doc.y;
    doc.rect(50, cardY, 500, 80).fill(COLORS.accent);
    doc.fillColor(COLORS.text).fontSize(14).font('Helvetica-Bold').text(user.name, 70, cardY + 15);
    doc.fillColor(COLORS.secondary).fontSize(10).font('Helvetica').text(user.email, 70, cardY + 35);
    doc.text(`Role: Intern`, 70, cardY + 50);

    // Summary Box
    doc.rect(380, cardY + 10, 150, 60).lineWidth(2).strokeColor(COLORS.primary).stroke();
    doc.fillColor(COLORS.primary).fontSize(8).font('Helvetica-Bold').text('OVERALL SCORE', 390, cardY + 20);
    doc.fontSize(24).text(`${stats.hireIndexScore}%`, 390, cardY + 35);

    doc.y = cardY + 100;
    drawSectionTitle(doc, 'Performance Metrics');

    const drawRow = (label, value) => {
        const top = doc.y;
        doc.fillColor(COLORS.text).fontSize(11).font('Helvetica').text(label, 60, top);
        doc.fillColor(COLORS.primary).font('Helvetica-Bold').text(value, 400, top, { align: 'right', width: 130 });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor(COLORS.border).lineWidth(0.5).stroke();
        doc.moveDown(0.5);
    };

    const completionRate = stats.totalTasksAssigned === 0 ? 0 : (stats.totalTasksCompleted / stats.totalTasksAssigned) * 100;
    const deadlineDiscipline = stats.totalTasksCompleted === 0 ? 0 : (stats.deadlinesMet / stats.totalTasksCompleted) * 100;

    drawRow('Task Completion Rate', `${Math.round(completionRate * 10) / 10}%`);
    drawRow('Average Feedback Score', `${Math.round(stats.mentorRatingAverage * 2 * 10) / 10}/10`);
    drawRow('Deadline Discipline', `${Math.round(deadlineDiscipline * 10) / 10}%`);
    drawRow('GitHub Activity Score', `${Math.round(stats.githubCommitCount / 10 * 10) / 10}/10`);
    drawRow('Code Quality Score', `${Math.round(stats.codeQualityScore / 10 * 10) / 10}/10`);
    drawRow('Communication Score', `${Math.round(stats.communicationScore / 10 * 10) / 10}/10`);
    drawRow('Total Assigned Tasks', stats.totalTasksAssigned.toString());
    drawRow('Tasks Completed', stats.totalTasksCompleted.toString());

    drawSectionTitle(doc, 'Performance Trend');
    doc.fillColor(COLORS.secondary).fontSize(10).font('Helvetica')
        .text('This intern is maintaining a consistent performance level above the organizational average.', { width: 500 });

    drawBrandedFooter(doc);
    doc.end();
});

// @desc    Export system analytics (PDF)
const exportSystemPdf = asyncHandler(async (req, res) => {
    const Intern = require('../users/intern.model');
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized for system export');
    }

    const interns = await Intern.find().populate('user', 'name');
    const data = interns
        .filter(intern => intern.user) // Remove orphans
        .map(intern => ({
            name: intern.user.name,
            score: intern.hireIndexScore
        }))
        .sort((a, b) => b.score - a.score);

    const doc = new PDFDocument({ margin: 50, bufferPages: true });
    res.setHeader('Content-disposition', `attachment; filename="nexora_system_analytics.pdf"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    drawBrandedHeader(doc, 'System Analytics Overview');
    drawSectionTitle(doc, 'Organizational Summary');

    const totalTasks = interns.reduce((acc, curr) => acc + curr.totalTasksAssigned, 0);

    const summaryY = doc.y;
    doc.rect(50, summaryY, 240, 60).fill(COLORS.accent);
    doc.fillColor(COLORS.secondary).fontSize(10).text('TOTAL INTERNS', 70, summaryY + 15);
    doc.fillColor(COLORS.text).fontSize(20).font('Helvetica-Bold').text(interns.length, 70, summaryY + 30);

    doc.rect(310, summaryY, 240, 60).fill(COLORS.accent);
    doc.fillColor(COLORS.secondary).fontSize(10).text('TOTAL TASKS TRACKED', 330, summaryY + 15);
    doc.fillColor(COLORS.text).fontSize(20).font('Helvetica-Bold').text(totalTasks, 330, summaryY + 30);

    doc.y = summaryY + 100;
    drawSectionTitle(doc, 'Intern Rankings');

    // Table Header
    const headY = doc.y;
    doc.fillColor(COLORS.secondary).fontSize(10).font('Helvetica-Bold');
    doc.text('Rank', 50, headY);
    doc.text('Intern Name', 100, headY);
    doc.text('Performance Score', 400, headY, { align: 'right', width: 140 });
    doc.moveTo(50, headY + 15).lineTo(550, headY + 15).strokeColor(COLORS.text).lineWidth(1).stroke();

    doc.y = headY + 25;
    data.forEach((item, index) => {
        if (doc.y > 680) {
            doc.addPage();
            drawBrandedHeader(doc, 'System Analytics Overview');
            doc.y = 130;
        }

        const currentY = doc.y;
        doc.fillColor(COLORS.text).fontSize(11).font('Helvetica');
        doc.text(index + 1, 50, currentY);
        doc.font('Helvetica-Bold').text(item.name, 100, currentY);
        doc.fillColor(COLORS.primary).text(`${item.score}%`, 400, currentY, { align: 'right', width: 140 });

        doc.moveDown(1.2);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor(COLORS.border).lineWidth(0.5).stroke();
        doc.moveDown(0.2);
    });

    drawBrandedFooter(doc);
    doc.end();
});

// @desc    Export leaderboard (PDF)
const exportLeaderboardPdf = asyncHandler(async (req, res) => {
    const User = require('../users/user.model');

    // Replicate UI leaderboard logic: match by User role, left join Intern data.
    const validInterns = await User.aggregate([
        { $match: { role: 'intern' } },
        {
            $lookup: {
                from: 'interns',
                localField: '_id',
                foreignField: 'user',
                as: 'internData'
            }
        },
        { $unwind: { path: '$internData', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                hireIndexScore: { $ifNull: ['$internData.hireIndexScore', 0] },
                hireIndexTrend: { $ifNull: ['$internData.hireIndexTrend', 0] }
            }
        },
        { $sort: { hireIndexScore: -1, name: 1 } },
        { $limit: 100 }
    ]);

    const doc = new PDFDocument({ margin: 40, bufferPages: true });
    res.setHeader('Content-disposition', `attachment; filename="nexora_leaderboard.pdf"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    drawBrandedHeader(doc, 'Top Performers Leaderboard');

    doc.fillColor(COLORS.text).fontSize(16).font('Helvetica-Bold').text('Nexora HireIndex™ Rankings', 50, doc.y);
    doc.fillColor(COLORS.secondary).fontSize(9).font('Helvetica').text('Top performing interns based on multi-dimensional performance metrics.', 50, doc.y + 2);
    doc.moveDown(1.5);

    // Table Header
    const tableTop = doc.y;
    doc.fillColor(COLORS.secondary).fontSize(9).font('Helvetica-Bold');
    doc.text('Rank', 60, tableTop);
    doc.text('Intern Name', 120, tableTop);
    doc.text('Score', 380, tableTop, { width: 60, align: 'right' });
    doc.text('Trend', 460, tableTop, { width: 60, align: 'right' });
    doc.moveTo(50, tableTop + 13).lineTo(540, tableTop + 13).strokeColor(COLORS.border).lineWidth(1).stroke();

    doc.y = tableTop + 20;

    validInterns.forEach((intern, index) => {
        const rank = index + 1;
        const currentY = doc.y;

        // Compact row height: 35 instead of 55
        const rowHeight = 35;

        // Highlight top 3
        if (rank <= 3) {
            doc.rect(50, currentY - 5, 500, rowHeight).fill(rank === 1 ? '#FFFBEB' : (rank === 2 ? '#F8FAFC' : '#FFF7ED'));
        }

        let rankLabel = `${rank}`;
        let rankColor = COLORS.secondary;
        if (rank === 1) { rankLabel = '1st'; rankColor = '#B45309'; }
        else if (rank === 2) { rankLabel = '2nd'; rankColor = '#475569'; }
        else if (rank === 3) { rankLabel = '3rd'; rankColor = '#9A3412'; }

        doc.fillColor(rankColor).fontSize(10).font('Helvetica-Bold').text(rankLabel, 60, currentY + 5);
        doc.fillColor(COLORS.text).fontSize(11).font('Helvetica-Bold').text(intern.name || 'Intern', 120, currentY + 5);
        doc.fillColor(COLORS.primary).fontSize(12).font('Helvetica-Bold').text(`${intern.hireIndexScore}%`, 380, currentY + 4, { width: 60, align: 'right' });

        const trend = intern.hireIndexTrend || 0;
        const growthPrefix = trend > 0 ? '+' : '';
        doc.fillColor(trend >= 0 ? COLORS.positive : COLORS.negative)
            .fontSize(9).font('Helvetica-Bold').text(`${growthPrefix}${trend}%`, 460, currentY + 6, { width: 60, align: 'right' });

        doc.y = currentY + rowHeight;

        // Auto page break if needed (unlikely for 20 entries with 35 height)
        if (doc.y > 680 && index < validInterns.length - 1) {
            doc.addPage();
            drawBrandedHeader(doc, 'Top Performers Leaderboard');
            doc.y = 150;
        }
    });

    drawBrandedFooter(doc);
    doc.end();
});

// @desc    Export system analytics (CSV)
const exportSystemCsv = asyncHandler(async (req, res) => {
    const Intern = require('../users/intern.model');
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized for system export');
    }
    const interns = await Intern.find().populate('user', 'name email');
    const data = interns
        .filter(intern => intern.user)
        .map((intern, index) => {
            const completionRate = intern.totalTasksAssigned === 0 ? 0 : (intern.totalTasksCompleted / intern.totalTasksAssigned) * 100;
            const deadlineDiscipline = intern.totalTasksCompleted === 0 ? 0 : (intern.deadlinesMet / intern.totalTasksCompleted) * 100;
            return {
                'Rank': index + 1,
                'Intern Name': intern.user?.name || 'Anonymous',
                'Email': intern.user?.email || 'N/A',
                'Overall Score (%)': intern.hireIndexScore,
                'Completion (%)': Math.round(completionRate * 10) / 10,
                'Avg Feedback (0-10)': Math.round(intern.mentorRatingAverage * 2 * 10) / 10,
                'Deadline Discipline (%)': Math.round(deadlineDiscipline * 10) / 10,
                'Total Tasks': intern.totalTasksAssigned,
                'Completed Tasks': intern.totalTasksCompleted
            };
        }).sort((a, b) => b['Overall Score (%)'] - a['Overall Score (%)']);

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('nexora_system_analytics.csv');
    return res.send(csv);
});

// @desc    Export leaderboard (CSV)
const exportLeaderboard = asyncHandler(async (req, res) => {
    const User = require('../users/user.model');

    const validInterns = await User.aggregate([
        { $match: { role: 'intern' } },
        {
            $lookup: {
                from: 'interns',
                localField: '_id',
                foreignField: 'user',
                as: 'internData'
            }
        },
        { $unwind: { path: '$internData', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                hireIndexScore: { $ifNull: ['$internData.hireIndexScore', 0] },
                hireIndexTrend: { $ifNull: ['$internData.hireIndexTrend', 0] }
            }
        },
        { $sort: { hireIndexScore: -1, name: 1 } },
        { $limit: 50 }
    ]);

    const data = validInterns
        .map((intern, index) => ({
            'Rank': index + 1,
            'Name': intern.name,
            'Score (%)': intern.hireIndexScore,
            'Trend (%)': `${intern.hireIndexTrend > 0 ? '+' : ''}${intern.hireIndexTrend || 0}%`
        }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('nexora_leaderboard.csv');
    return res.send(csv);
});

module.exports = {
    exportInternPdf,
    exportSystemCsv,
    exportSystemPdf,
    exportLeaderboard,
    exportLeaderboardPdf
};
