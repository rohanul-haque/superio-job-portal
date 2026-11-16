import { StatusCodes } from "http-status-codes";
import config from "../config";
import resend from "../lib/resend";
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

export const sendVerificationEmail = async ({
  to,
  name,
  role,
}: ISendVerificationEmailOptions): Promise<void> => {
  const verificationUrl = `${config.FRONTEND_URL}/verify-email`;
  const html = getVerificationEmailTemplate({ name, role, verificationUrl });
  const from =
    config.RESEND_FROM_EMAIL ||
    config.EMAIL_FROM ||
    "Superio Job Portal <onboarding@resend.dev>";
  const subject = `[Superio] Verify your email address (${role.toUpperCase()})`;

  try {
    if (resend) {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        console.error(
          `[Resend Error] Failed to send verification email to ${to}:`,
          error,
        );
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to dispatch verification email. Please try again later.",
        );
      }

      console.log(
        `[Email] Verification email dispatched to ${to} via Resend (ID: ${data?.id})`,
      );
    } else {
      console.log(
        "\n================== EMAIL VERIFICATION (DEV FALLBACK - RESEND NOT CONFIGURED) ==================",
      );
      console.log(`To: ${to} (${name}) [Role: ${role}]`);
      console.log(`Verification URL (Zero-Token): ${verificationUrl}`);
      console.log(
        "=================================================================================================\n",
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error(`[Email Error] Failed to send email to ${to}:`, error);
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
  const from =
    config.RESEND_FROM_EMAIL ||
    config.EMAIL_FROM ||
    "Superio Job Portal <onboarding@resend.dev>";
  const subject = "[Superio] Reset your password";

  try {
    if (resend) {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        console.error(
          `[Resend Error] Failed to send password reset email to ${to}:`,
          error,
        );
        return;
      }

      console.log(
        `[Email] Password reset email sent successfully to ${to} via Resend (ID: ${data?.id})`,
      );
    } else {
      console.log(
        "\n================== PASSWORD RESET (DEV FALLBACK - RESEND NOT CONFIGURED) ==================",
      );
      console.log(`To: ${to} (${name})`);
      console.log(`Reset URL (Zero-Token): ${resetUrl}`);
      console.log(
        "===========================================================================================\n",
      );
    }
  } catch (error) {
    console.error(
      `[Email Error] Failed to send password reset email to ${to}:`,
      error,
    );
  }
};
