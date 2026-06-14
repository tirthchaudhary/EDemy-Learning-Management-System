const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter using your Gmail settings
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // MUST be true for port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `EDemy Support <${process.env.EMAIL_USER}>`, // Gmail requires the 'from' email to match your EMAIL_USER account
        to: options.email,
        subject: options.subject,
        text: options.message, // Fallback plain text
        html: options.html,    // HTML content for rich formatting/buttons
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
