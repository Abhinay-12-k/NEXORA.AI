const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Low-level Email Service to handle SMTP transport and sending.
 * Configured for Gmail SMTP with robust error handling.
 */
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // false for port 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS, // Uses Gmail App Password
            },
            tls: {
                // Required for many Gmail SMTP connections
                rejectUnauthorized: false
            }
        });

        // Verify the connection configuration on initialization
        this._verifyConnection();
    }

    /**
     * Verifies if the transporter can connect to the SMTP server.
     * @private
     */
    async _verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('[EmailService] SMTP Connection has been established successfully.');
        } catch (error) {
            this._logError('Initialization', error);
        }
    }

    /**
     * Centralized internal error logger
     * @private
     */
    _logError(context, error) {
        if (error.code === 'EAUTH') {
            console.error(`[EmailService] [${context}] Authentication Failed: Invalid credentials or App Password.`);
        } else if (error.code === 'ESOCKET' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            console.error(`[EmailService] [${context}] Connection Issue: Could not connect to the SMTP host.`);
        } else if (error.command === 'CONN') {
            console.error(`[EmailService] [${context}] Connection Error: Failed at connection stage.`);
        } else {
            console.error(`[EmailService] [${context}] Error:`, error.message);
        }
    }

    /**
     * Send an email asynchronously
     * @param {Object} options - { to, subject, html }
     */
    async sendEmail({ to, subject, html }) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('[EmailService] Missing SMTP credentials. Email sending aborted.');
            return null;
        }

        try {
            const info = await this.transporter.sendMail({
                from: `"${process.env.SMTP_FROM_NAME || 'Nexora AI'}" <${process.env.SMTP_FROM_EMAIL}>`,
                to,
                subject,
                html,
            });

            console.log(`[EmailService] Email sent: ${info.messageId}`);
            return info;
        } catch (error) {
            this._logError('SendEmail', error);
            // Return null as per existing logic to indicate failure without crashing the flow
            return null;
        }
    }
}

module.exports = new EmailService();

