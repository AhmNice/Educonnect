// utils/emailTemplates.js

const emailStyles = `
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #374151;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 40px 32px;
      text-align: center;
      color: white;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .tagline {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 500;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
    }
    .message {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 24px;
    }
    .highlight-box {
      background: linear-gradient(135deg, #f0f4ff, #faf5ff);
      border-left: 4px solid #4f46e5;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .otp-code {
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      color: #4f46e5;
      letter-spacing: 8px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      padding: 12px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 16px 0;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 14px;
      color: #9ca3af;
    }
    .security-note {
      font-size: 14px;
      color: #ef4444;
      text-align: center;
      margin-top: 16px;
    }
  </style>
`;

const generateEmailTemplate = (content) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduConnect</title>
    ${emailStyles}
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EduConnect</div>
            <div class="tagline">Connecting Students, Empowering Education</div>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <div class="footer-text">
                © 2024 EduConnect. All rights reserved.<br>
                Building better learning communities together.
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

// 1. Welcome Email
export const generateWelcomeEmail = (userName, universityName) => {
  const content = `
    <div class="greeting">Welcome to EduConnect, ${userName}! 🎉</div>
    <div class="message">
      We're thrilled to have you join our community of learners and educators.
      Your educational journey at <strong>${universityName}</strong> just got more connected and collaborative.
    </div>

    <div class="highlight-box">
      <strong>Get Started:</strong><br>
      • Complete your profile<br>
      • Join study groups in your courses<br>
      • Connect with classmates<br>
      • Access shared resources<br>
      • Schedule study sessions
    </div>

    <div class="message">
      Ready to enhance your learning experience?
      <a href="#" class="button" style="color: white; text-decoration: none;">Explore Your Dashboard</a>
    </div>

    <div class="message">
      If you have any questions or need assistance, don't hesitate to reach out to our support team.
    </div>
  `;

  return generateEmailTemplate(content);
};

// 2. OTP Email
export const generateOTPEmail = (userName, otpCode, purpose = "verification") => {
  const purposeText = {
    verification: "verify your email address",
    login: "complete your login",
    reset: "reset your password",
    security: "complete a security verification"
  }[purpose] || "complete your verification";

  const content = `
    <div class="greeting">Verification Code</div>
    <div class="message">
      Hello ${userName},<br><br>
      Use the following One-Time Password (OTP) to ${purposeText}:
    </div>

    <div class="otp-code">${otpCode}</div>

    <div class="message">
      This code will expire in <strong>5 minutes</strong> for security reasons.
    </div>

    <div class="security-note">
      ⚠️ Never share this code with anyone. EduConnect will never ask for your OTP.
    </div>

    <div class="message">
      If you didn't request this code, please ignore this email or contact support if you're concerned.
    </div>
  `;

  return generateEmailTemplate(content);
};

// 3. Reset Password Link Email
export const generateResetPasswordEmail = (userName, resetLink) => {
  const content = `
    <div class="greeting">Reset Your Password</div>
    <div class="message">
      Hello ${userName},<br><br>
      We received a request to reset your EduConnect password. Click the button below to create a new password:
    </div>

    <div style="text-align: center;">
      <a href="${resetLink}" class="button" style="color: white; text-decoration: none;">
        Reset Password
      </a>
    </div>

    <div class="message">
      This password reset link will expire in <strong>5 minutes</strong> for security reasons.
    </div>

    <div class="security-note">
      ⚠️ If you didn't request a password reset, please ignore this email.
      Your account remains secure.
    </div>

    <div class="message">
      Or copy and paste this link in your browser:<br>
      <small style="color: #6b7280; word-break: break-all;">${resetLink}</small>
    </div>
  `;

  return generateEmailTemplate(content);
};

// 4. Password Reset Success Email
export const generatePasswordResetSuccessEmail = (userName) => {
  const content = `
    <div class="greeting">Password Updated Successfully ✅</div>
    <div class="message">
      Hello ${userName},<br><br>
      Your EduConnect password has been successfully reset. Your account is now secured with your new password.
    </div>

    <div class="highlight-box">
      <strong>Security Tips:</strong><br>
      • Use a strong, unique password<br>
      • Enable two-factor authentication<br>
      • Never share your login credentials<br>
      • Log out from shared devices<br>
      • Regularly update your password
    </div>

    <div class="message">
      If you made this change, you're all set! If you didn't reset your password,
      <a href="#" style="color: #4f46e5;">contact our support team immediately</a>.
    </div>
  `;

  return generateEmailTemplate(content);
};

// Export all templates
export default {
  generateWelcomeEmail,
  generateOTPEmail,
  generateResetPasswordEmail,
  generatePasswordResetSuccessEmail
};