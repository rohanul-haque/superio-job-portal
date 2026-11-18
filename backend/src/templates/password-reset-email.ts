export interface IPasswordResetEmailTemplateOptions {
  name: string;
  resetUrl: string;
  expirationMinutes?: number;
}

const getPasswordResetEmailTemplate = ({
  name,
  resetUrl,
  expirationMinutes = 15,
}: IPasswordResetEmailTemplateOptions): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - HireNest</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15,23,42,0.08); border: 1px solid #e2e8f0; }
        .header { background: #4f46e5; padding: 36px 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px 36px; color: #334155; line-height: 1.6; }
        .content h2 { margin-top: 0; color: #0f172a; font-size: 22px; font-weight: 700; }
        .btn-wrapper { text-align: center; margin: 36px 0; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 14px 36px; font-size: 15px; font-weight: 600; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
        .notice-box { background: #f1f5f9; border-left: 4px solid #4f46e5; border-radius: 6px; padding: 16px 18px; margin: 28px 0; font-size: 13px; color: #475569; }
        .fallback-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px 16px; margin: 24px 0; font-size: 12px; color: #64748b; word-break: break-all; }
        .fallback-box a { color: #4f46e5; text-decoration: underline; }
        .footer { background: #f8fafc; padding: 24px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HireNest</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset the password for your HireNest account. Click the button below to choose a new, secure password:</p>
          
          <div class="btn-wrapper">
            <a href="${resetUrl}" class="btn" target="_blank" rel="noopener noreferrer">Reset Password</a>
          </div>

          <div class="notice-box">
            <strong>Security Notice:</strong> This password reset link is valid for <strong>${expirationMinutes} minutes</strong> and can only be used once. If you did not request this password reset, you can safely ignore this email; your current password will remain unchanged.
          </div>

          <div class="fallback-box">
            <p style="margin: 0 0 6px 0; font-weight: 600; color: #334155;">Having trouble with the button?</p>
            Copy and paste this URL into your browser:<br />
            <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} HireNest Enterprise Job Portal. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export default getPasswordResetEmailTemplate;
