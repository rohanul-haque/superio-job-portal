export interface IApplicationRejectedEmailOptions {
  candidateName: string;
  jobTitle: string;
  companyName: string;
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const getApplicationRejectedEmailSubject = (
  jobTitle: string,
): string => {
  return `Application Status Update – ${jobTitle}`;
};

export const getApplicationRejectedEmailTemplate = ({
  candidateName,
  jobTitle,
  companyName,
}: IApplicationRejectedEmailOptions): string => {
  const safeCandidateName = escapeHtml(candidateName || "Candidate");
  const safeJobTitle = escapeHtml(jobTitle);
  const safeCompanyName = escapeHtml(companyName);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Status Update – ${safeJobTitle}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: #475569; padding: 28px 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 36px 32px; color: #334155; line-height: 1.65; font-size: 15px; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: #fee2e2; color: #b91c1c; margin-bottom: 18px; border: 1px solid #fecaca; }
        .info-card { background: #f8fafc; border-left: 4px solid #94a3b8; border-radius: 6px; padding: 16px 20px; margin: 24px 0; }
        .info-card p { margin: 4px 0; font-size: 14px; color: #475569; }
        .info-card strong { color: #0f172a; }
        .signoff { margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9; color: #475569; }
        .powered-by { font-size: 13px; color: #64748b; margin-top: 4px; }
        .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Hirenest</h1>
        </div>
        <div class="content">
          <span class="badge">Application Update</span>
          <p>Dear ${safeCandidateName},</p>
          <p>Thank you for your interest in the <strong>${safeJobTitle}</strong> position at <strong>${safeCompanyName}</strong>.</p>
          <p>After reviewing your application, we regret to inform you that you have not been selected to proceed further in the recruitment process for this position.</p>

          <div class="info-card">
            <p><strong>Position:</strong> ${safeJobTitle}</p>
            <p><strong>Company:</strong> ${safeCompanyName}</p>
            <p><strong>Status:</strong> Not Selected</p>
          </div>

          <p>We appreciate the time and effort you invested in applying.</p>
          <p>We encourage you to explore other opportunities that match your skills and experience.</p>
          <p>We wish you success in your career journey.</p>

          <div class="signoff">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 4px 0 0 0; font-weight: 700; color: #0f172a;">${safeCompanyName}</p>
            <p class="powered-by">Powered by Hirenest</p>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ${safeCompanyName}. Powered by Hirenest. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export default getApplicationRejectedEmailTemplate;
