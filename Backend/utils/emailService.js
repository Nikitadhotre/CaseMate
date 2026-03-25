const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send welcome email
const sendWelcomeEmail = async (email, name, role) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to CaseMate!',
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header with Slate Gradient -->
        <div style="background: linear-gradient(to right, #334155, #1e293b); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">CaseMate</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Unified Legal Case Management System</p>
        </div>
        <!-- Body -->
        <div style="padding: 30px; background-color: #f8fafc;">
          <h2 style="color: #1e293b; font-size: 22px; margin-bottom: 20px;">Welcome to CaseMate, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Thank you for joining our platform as a ${role}. We're excited to have you on board!</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">You can now access your dashboard, search for lawyers, track your cases, and get AI-powered legal guidance.</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">If you have any questions, feel free to contact our support team.</p>
          <a href="#" style="display: inline-block; background-color: #334155; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Get Started</a>
        </div>
        <!-- Footer -->
        <div style="background-color: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">Best regards,<br>The CaseMate Team</p>
          <p style="margin: 10px 0 0 0;">© 2023 CaseMate. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send hearing reminder email
const sendHearingReminderEmail = async (email, name, caseTitle, hearingDate, role, clientName = null, lawyerName = null) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Upcoming Hearing Reminder - ${caseTitle}`,
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
        <!-- Header with Slate Gradient -->
        <div style="background: linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%); color: white; padding: 30px 20px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg></div>
          <div style="position: relative; z-index: 1;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">⚖️ CaseMate</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Hearing Reminder Notification</p>
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); margin-bottom: 25px;">
            <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: 600;">Upcoming Hearing Reminder</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.7; margin-bottom: 20px;">Dear <strong style="color: #334155;">${name}</strong>,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.7; margin-bottom: 25px;">This is an important reminder about your upcoming hearing for the case: <strong style="color: #dc2626; font-size: 18px;">${caseTitle}</strong>${role === 'lawyer' && clientName ? `<br><br><strong>Client:</strong> ${clientName}` : ''}${role === 'client' && lawyerName ? `<br><br><strong>Lawyer:</strong> ${lawyerName}` : ''}</p>
          </div>

          <!-- Hearing Details Card -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 25px 0; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; right: 0; width: 60px; height: 60px; background: #f59e0b; border-radius: 0 12px 0 100%; opacity: 0.1;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="font-size: 20px;">📅</span>
                </div>
                <h3 style="color: #92400e; font-size: 20px; font-weight: 600; margin: 0;">Hearing Scheduled</h3>
              </div>
              <div style="background: white; border-radius: 8px; padding: 20px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600; line-height: 1.4;">${new Date(hearingDate).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>

          <!-- Action Items -->
          <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); margin-bottom: 25px;">
            <h3 style="color: #1e293b; font-size: 18px; margin-bottom: 15px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">✅</span>
              Please ensure you are prepared for this hearing
            </h3>
            <ul style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0; padding-left: 25px;">
              <li style="margin-bottom: 8px;">Review all case documents and evidence</li>
              <li style="margin-bottom: 8px;">Prepare any required paperwork</li>
              <li style="margin-bottom: 8px;">Contact your ${role === 'client' ? 'lawyer' : 'client'} if you have questions</li>
              <li>Arrive at least 15 minutes early</li>
            </ul>
          </div>

          <!-- CTA Buttons -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #334155 0%, #1e293b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 15px; box-shadow: 0 4px 12px rgba(51, 65, 85, 0.3); transition: transform 0.2s;">View Case Details</a>
            <a href="#" style="display: inline-block; border: 2px solid #334155; color: #334155; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; background: white;">Contact Support</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 25px 20px; text-align: center; font-size: 14px; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain2" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="20" cy="80" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="80" cy="20" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain2)"/></svg></div>
          <div style="position: relative; z-index: 1;">
            <p style="margin: 0; font-weight: 500;">Best regards,<br><strong>The CaseMate Team</strong></p>
            <p style="margin: 12px 0 0 0; opacity: 0.8;">© 2023 CaseMate. All rights reserved.</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0; font-size: 12px; opacity: 0.7;">This is an automated reminder. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Hearing reminder email sent to ${email} for case: ${caseTitle}`);
  } catch (error) {
    console.error('Error sending hearing reminder email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendHearingReminderEmail,
};
