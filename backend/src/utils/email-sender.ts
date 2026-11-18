import { StatusCodes } from "http-status-codes";
import type { SentMessageInfo } from "nodemailer";
import nodemailer from "nodemailer";
import config from "../config";
import {
  getApplicationPendingEmailSubject,
  getApplicationPendingEmailTemplate,
} from "../templates/application-pending-email";
import {
  getApplicationRejectedEmailSubject,
  getApplicationRejectedEmailTemplate,
} from "../templates/application-rejected-email";
import {
  getApplicationShortlistedEmailSubject,
  getApplicationShortlistedEmailTemplate,
} from "../templates/application-shortlisted-email";
import getPasswordResetEmailTemplate from "../templates/password-reset-email";
import getVerificationEmailTemplate from "../templates/verification-email";
import AppError from "./AppError";

// Nodemailer Gmail SMTP Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface ISendVerificationEmailOptions {
  to: string;
  name: string;
  role: "candidate" | "recruiter";
}

export interface ISendPasswordResetEmailOptions {
  to: string;
  name: string;
  token: string;
  expirationMinutes?: number;
}

export const getSenderAddress = (): string => {
  if (config.EMAIL_FROM) {
    return config.EMAIL_FROM;
  }
  if (config.EMAIL_USER) {
    return `"HireNest" <${config.EMAIL_USER}>`;
  }
  return `"HireNest" <no-reply@hirenest.com>`;
};

// Common reusable sendEmail function
export const sendEmail = async ({
  to,
  subject,
  html,
  from = getSenderAddress(),
}: ISendEmailOptions): Promise<SentMessageInfo | void> => {
  if (config.EMAIL_USER && config.EMAIL_PASS) {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(
      `[Email] Email sent successfully to ${to} via Gmail SMTP (MessageID: ${info.messageId})`,
    );
    return info;
  } else {
    console.log(
      "\n================== EMAIL DISPATCH (DEV FALLBACK - GMAIL SMTP NOT CONFIGURED) ==================",
    );
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(
      "=================================================================================================\n",
    );
  }
};

export const sendVerificationEmail = async ({
  to,
  name,
  role,
}: ISendVerificationEmailOptions): Promise<void> => {
  const verificationUrl = `${config.FRONTEND_URL}/verify-email`;
  const html = getVerificationEmailTemplate({ name, role, verificationUrl });
  const from = getSenderAddress();
  const subject = `[HireNest] Verify your email address (${role.toUpperCase()})`;

  try {
    if (config.EMAIL_USER && config.EMAIL_PASS) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(
        `[Email] Verification email dispatched to ${to} via Gmail SMTP (MessageID: ${info.messageId})`,
      );
    } else {
      console.log(
        "\n================== EMAIL VERIFICATION (DEV FALLBACK - GMAIL SMTP NOT CONFIGURED) ==================",
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
  token,
  expirationMinutes = config.PASSWORD_RESET_EXPIRES_IN_MINUTES || 15,
}: ISendPasswordResetEmailOptions): Promise<void> => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;
  const html = getPasswordResetEmailTemplate({
    name,
    resetUrl,
    expirationMinutes,
  });
  const from = getSenderAddress();
  const subject = "[HireNest] Reset your password";

  try {
    if (config.EMAIL_USER && config.EMAIL_PASS) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(
        `[Email] Password reset email sent successfully to ${to} via Gmail SMTP (MessageID: ${info.messageId})`,
      );
    } else {
      console.log(
        "\n================== PASSWORD RESET (DEV FALLBACK - GMAIL SMTP NOT CONFIGURED) ==================",
      );
      console.log(`To: ${to} (${name})`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log(`Expires in: ${expirationMinutes} minutes`);
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

export type ApplicationNotificationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "REJECTED";

export interface ISendApplicationStatusEmailOptions {
  to: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationNotificationStatus;
}

export const sendApplicationStatusEmail = async ({
  to,
  candidateName,
  jobTitle,
  companyName,
  status,
}: ISendApplicationStatusEmailOptions): Promise<void> => {
  const normalizedStatus = status.trim().toUpperCase() as ApplicationNotificationStatus;

  let subject = "";
  let html = "";

  switch (normalizedStatus) {
    case "PENDING":
      subject = getApplicationPendingEmailSubject(jobTitle);
      html = getApplicationPendingEmailTemplate({
        candidateName,
        jobTitle,
        companyName,
      });
      break;
    case "SHORTLISTED":
      subject = getApplicationShortlistedEmailSubject(jobTitle);
      html = getApplicationShortlistedEmailTemplate({
        candidateName,
        jobTitle,
        companyName,
      });
      break;
    case "REJECTED":
      subject = getApplicationRejectedEmailSubject(jobTitle);
      html = getApplicationRejectedEmailTemplate({
        candidateName,
        jobTitle,
        companyName,
      });
      break;
    default:
      console.warn(
        `[Email Warning] No email template mapped for status: ${status}`,
      );
      return;
  }

  const from = getSenderAddress();

  try {
    if (config.EMAIL_USER && config.EMAIL_PASS) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(
        `[Email] Application status (${normalizedStatus}) email sent successfully to ${to} via Gmail SMTP (MessageID: ${info.messageId})`,
      );
    } else {
      console.log(
        "\n================== APPLICATION STATUS EMAIL (DEV FALLBACK - GMAIL SMTP NOT CONFIGURED) ==================",
      );
      console.log(`To: ${to} (${candidateName})`);
      console.log(`Status: ${normalizedStatus}`);
      console.log(`Job: ${jobTitle} | Company: ${companyName}`);
      console.log(`Subject: ${subject}`);
      console.log(
        "=========================================================================================================\n",
      );
    }
  } catch (error) {
    console.error(
      `[Email Error] Failed to send ${normalizedStatus} application status email to ${to}:`,
      error,
    );
    throw error;
  }
};

