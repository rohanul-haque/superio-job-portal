export interface IPasswordResetEmailTemplateOptions {
  name: string;
  resetUrl: string;
}

const getPasswordResetEmailTemplate = ({
  name,
  resetUrl,
}: IPasswordResetEmailTemplateOptions): string => {
  return `
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
};

export default getPasswordResetEmailTemplate;
