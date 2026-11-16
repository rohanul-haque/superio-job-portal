export interface IApplicationShortlistedEmailOptions {
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

export const getApplicationShortlistedEmailSubject = (
  jobTitle: string,
): string => {
  return `Congratulations! You've Been Shortlisted – ${jobTitle}`;
};

export const getApplicationShortlistedEmailTemplate = ({
  candidateName,
  jobTitle,
  companyName,
}: IApplicationShortlistedEmailOptions): string => {
  const safeCandidateName = escapeHtml(candidateName || "Candidate");
  const safeJobTitle = escapeHtml(jobTitle);
  const safeCompanyName = escapeHtml(companyName);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Congratulations! You've Been Shortlisted – ${safeJobTitle}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: #16a34a; padding: 28px 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 36px 32px; color: #334155; line-height: 1.65; font-size: 15px; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: #dcfce7; color: #15803d; margin-bottom: 18px; border: 1px solid #bbf7d0; }
        .congrats-heading { color: #16a34a; font-size: 18px; font-weight: 700; margin: 12px 0; }
        .info-card { background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 6px; padding: 16px 20px; margin: 24px 0; }
        .info-card p { margin: 4px 0; font-size: 14px; color: #166534; }
        .info-card strong { color: #14532d; }
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
          <span class="badge">Application Shortlisted</span>
          <p>Dear ${safeCandidateName},</p>
          <p class="congrats-heading">Congratulations!</p>
          <p>We are pleased to inform you that you have been <strong>shortlisted</strong> for the <strong>${safeJobTitle}</strong> position at <strong>${safeCompanyName}</strong>.</p>
          
          <div class="info-card">
            <p><strong>Position:</strong> ${safeJobTitle}</p>
            <p><strong>Company:</strong> ${safeCompanyName}</p>
            <p><strong>Status:</strong> Shortlisted</p>
          </div>

          <p>Your application has successfully passed the initial review stage.</p>
          <p>The recruitment team may contact you regarding the next steps in the hiring process.</p>
          <p>Thank you for your interest in joining ${safeCompanyName}.</p>

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

export default getApplicationShortlistedEmailTemplate;
