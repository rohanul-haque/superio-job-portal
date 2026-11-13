import config from "../config";
import transporter from "../lib/nodemailer";
import AppError from "./AppError";

export interface ISendVerificationEmailOptions {
  to: string;
  name: string;
  role: "candidate" | "recruiter";
}

export interface ISendPasswordResetEmailOptions {
  to: string;
  name: string;
}

export const sendVerificationEmail = async ({
  to,
  name,
  role,
}: ISendVerificationEmailOptions): Promise<void> => {
  // Clean verification link without any token, query parameter, or path parameter
  const verificationUrl = `${config.FRONTEND_URL}/verify-email`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Superio Job Portal</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .header { background: #1967d2; padding: 32px 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 36px 32px; color: #333333; line-height: 1.6; }
        .content h2 { margin-top: 0; color: #111827; font-size: 20px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; }
        .badge-candidate { background: #e0f2fe; color: #0284c7; }
        .badge-recruiter { background: #fef3c7; color: #d97706; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background-color: #1967d2; color: #ffffff !important; padding: 14px 32px; font-size: 15px; font-weight: 600; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 8px rgba(25,103,210,0.3); }
        .notice-box { background: #f8fafc; border-left: 4px solid #1967d2; border-radius: 4px; padding: 14px 16px; margin: 24px 0; font-size: 13px; color: #475569; }
        .footer { background: #f9fafb; padding: 20px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Superio Job Portal</h1>
        </div>
        <div class="content">
          <span class="badge badge-${role}">${role} Account</span>
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for signing up for <strong>Superio Job Portal (Enterprise Edition)</strong>. To activate your account and start using our platform, please click the verification button below.</p>
          
          <div class="btn-wrapper">
            <a href="${verificationUrl}" class="btn" target="_blank" rel="noopener noreferrer">Verify Email Address</a>
          </div>

          <div class="notice-box">
            <strong>Security Notice:</strong> Your email verification link is valid for 5 minutes. Please verify your email before it expires. For a seamless one-click experience, please open this link on the device where you registered, or sign in to verify on a new device.
          </div>

          <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">If you did not create an account on Superio, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Superio Enterprise. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (config.GMAIL_USER && config.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from:
          config.EMAIL_FROM || `"Superio Job Portal" <${config.GMAIL_USER}>`,
        to,
        subject: `[Superio] Verify your email address (${role.toUpperCase()})`,
        html,
      });
      console.log(
        `[Email] Verification email dispatched to ${to} via Gmail SMTP`,
      );
    } else {
      console.log(
        "\n================== EMAIL VERIFICATION (DEV FALLBACK) ==================",
      );
      console.log(`To: ${to} (${name}) [Role: ${role}]`);
      console.log(`Verification URL (Zero-Token): ${verificationUrl}`);
      console.log(
        "=========================================================================\n",
      );
    }
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${to}:`, error);
    throw new AppError(
      500,
      "Failed to dispatch verification email. Please try again later.",
    );
  }
};

export const sendPasswordResetEmail = async ({
  to,
  name,
}: ISendPasswordResetEmailOptions): Promise<void> => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Superio Job Portal</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .header { background: #1967d2; padding: 32px 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 36px 32px; color: #333333; line-height: 1.6; }
        .content h2 { margin-top: 0; color: #111827; font-size: 20px; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background-color: #1967d2; color: #ffffff !important; padding: 14px 32px; font-size: 15px; font-weight: 600; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 8px rgba(25,103,210,0.3); }
        .notice-box { background: #f8fafc; border-left: 4px solid #1967d2; border-radius: 4px; padding: 14px 16px; margin: 24px 0; font-size: 13px; color: #475569; }
        .footer { background: #f9fafb; padding: 20px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Superio Job Portal</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password for your Superio Job Portal account. Click the button below to choose a new password:</p>
          
          <div class="btn-wrapper">
            <a href="${resetUrl}" class="btn" target="_blank" rel="noopener noreferrer">Reset Password</a>
          </div>

          <div class="notice-box">
            <strong>Security Notice:</strong> If you did not request this password reset, please ignore this email or contact support immediately.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Superio Enterprise. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (config.GMAIL_USER && config.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from:
          config.EMAIL_FROM || `"Superio Job Portal" <${config.GMAIL_USER}>`,
        to,
        subject: "[Superio] Reset your password",
        html,
      });
      console.log(
        `[Email] Password reset email sent successfully to ${to} via Gmail SMTP`,
      );
    } else {
      console.log(
        "\n================== PASSWORD RESET (DEV FALLBACK) ==================",
      );
      console.log(`To: ${to} (${name})`);
      console.log(`Reset URL (Zero-Token): ${resetUrl}`);
      console.log(
        "====================================================================\n",
      );
    }
  } catch (error) {
    console.error(
      `[Email Error] Failed to send password reset email to ${to}:`,
      error,
    );
  }
};
