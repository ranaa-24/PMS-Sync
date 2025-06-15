import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv';
dotenv.config();

// docs ref: https://www.twilio.com/docs/sendgrid/for-developers/sending-email/quickstart-nodejs

sgMail.setApiKey(process.env.MAIL_API);

const fromEmail = process.env.FROM_EMAIL;

async function sendMail(toEmail, subject, content) {
    try {
        const msg = {
            to: toEmail,
            from: fromEmail,
            subject: subject,
            html: content,
        };

        await sgMail.send(msg);
        console.log(`Email sent to ${toEmail}`);
    
        return true;
    } catch (error) {
        console.error(`Error sending email to ${toEmail}:`, error);
        return false;
    }
}

export default sendMail;