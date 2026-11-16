import { StatusCodes } from "http-status-codes";
import config from "../config";
import transporter from "../lib/email-transporter";
import getPasswordResetEmailTemplate from "../templates/email/password-reset-email";
import getVerificationEmailTemplate from "../templates/email/verification-email";
import AppError from "../utils/AppError";

export interface ISendVerificationEmailOptions {
  to: string;
  name: string;
  role: "candidate" | "recruiter";
}

export interface ISendPasswordResetEmailOptions {
  to: string;
  name: string;
}

const getSenderAddress = (): string => {
  if (config.BREVO_FROM_EMAIL) {
    return config.BREVO_FROM_NAME
      ? `"${config.BREVO_FROM_NAME}" <${config.BREVO_FROM_EMAIL}>`
      : config.BREVO_FROM_EMAIL;
  }
  return `"HireNest" <no-reply@hirenest.com>`;
};

export const sendVerificationEmail = async ({
  to,
  name,
  role,
}: ISendVerificationEmailOptions): Promise<void> => {
  const verificationUrl = `${config.FRONTEND_URL}/verify-email`;
  const html = getVerificationEmailTemplate({ name, role, verificationUrl });
  const from = getSenderAddress();
  const subject = `[Superio] Verify your email address (${role.toUpperCase()})`;

  try {
    if (config.BREVO_SMTP_USER && config.BREVO_SMTP_KEY) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(
        `[Email] Verification email dispatched to ${to} via Brevo SMTP (MessageID: ${info.messageId})`,
      );
    } else {
      console.log(
        "\n================== EMAIL VERIFICATION (DEV FALLBACK - BREVO SMTP NOT CONFIGURED) ==================",
      );
      console.log(`To: ${to} (${name}) [Role: ${role}]`);
      console.log(`Verification URL (Zero-Token): ${verificationUrl}`);
      console.log(
        "====================================================================================================\n",
      );
    }
  } catch (error) {
    console.error(
      `[Email Error] Failed to send verification email to ${to}:`,
      error,
    );
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to dispatch verification email. Please try again later.",
    );
  }
};

export const sendPasswordResetEmail = async ({
  to,
  name,
}: ISendPasswordResetEmailOptions): Promise<void> => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password`;
  const html = getPasswordResetEmailTemplate({ name, resetUrl });
  const from = getSenderAddress();
  const subject = "[Superio] Reset your password";

  try {
    if (config.BREVO_SMTP_USER && config.BREVO_SMTP_KEY) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(
        `[Email] Password reset email sent successfully to ${to} via Brevo SMTP (MessageID: ${info.messageId})`,
      );
    } else {
      console.log(
        "\n================== PASSWORD RESET (DEV FALLBACK - BREVO SMTP NOT CONFIGURED) ==================",
      );
      console.log(`To: ${to} (${name})`);
      console.log(`Reset URL (Zero-Token): ${resetUrl}`);
      console.log(
        "===============================================================================================\n",
      );
    }
  } catch (error) {
    console.error(
      `[Email Error] Failed to send password reset email to ${to}:`,
      error,
    );
  }
};
