import { sender, transporter } from "../config/email.config.js";
import { generateOTPEmail, generatePasswordResetSuccessEmail, generateResetPasswordEmail } from "./email.template.js";

const mailOption = ({ email, subject, html }) => ({
  from: sender,
  to: email,
  subject: subject,
  html: html
});

export const sendPasswordResetLink = async (user) => {
  const { email } = user
  const subject = `Reset Password Link`
  const htmlContent = generateResetPasswordEmail(user.full_name, user.resetLink);
  try {
    await transporter.sendMail(mailOption({ email, subject, html: htmlContent }));
    console.log('email send successfully 📨')
  } catch (error) {
    console.error('Error sending password reset link email:', error);
    throw error;
  }
}
export const sendPasswordResetSuccessEmail = async (user) => {
  const subject = `Password Reset`;
  const htmlContent = generatePasswordResetSuccessEmail(user.full_name);
  try {
    await transporter.sendMail(mailOption({ email: user.email, subject, html: htmlContent }));
    console.log('email send successfully 📨')
  } catch (error) {
    console.error('Error sending password updated successfully email:', error);
    throw error;
  }
}
export const sendOTPEmail = async (user) => {
  const subject = "Account Verification";
  const htmlContent = generateOTPEmail(user.full_name, user.otp, 'Account verification');
  try {
    await transporter.sendMail(mailOption({ email: user.email, subject, html: htmlContent }))
    console.log('email send successfully 📨')
  } catch (error) {
    console.error('Error sending otp email:', error);
    throw error;
  }
}