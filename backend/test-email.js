const emailService = require('./src/modules/notifications/email.service');

async function testConnection() {
    console.log('Testing Email Service connection...');
    // The constructor already calls _verifyConnection(), but we can do it again manually or just wait.
    // Let's also try to send a test email to the configured sender as a proof of concept.

    try {
        const result = await emailService.sendEmail({
            to: process.env.SMTP_USER,
            subject: 'Nexora AI - SMTP Test',
            html: '<h1>SMTP Configuration Successful</h1><p>Your Gmail SMTP configuration is working correctly.</p>'
        });

        if (result) {
            console.log('Test email sent successfully!');
        } else {
            console.log('Test email failed to send.');
        }
    } catch (error) {
        console.error('Test script error:', error);
    }
}

testConnection();
