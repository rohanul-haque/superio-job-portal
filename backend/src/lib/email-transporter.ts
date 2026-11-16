import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: config.BREVO_SMTP_HOST,
  port: config.BREVO_SMTP_PORT,
  secure: config.BREVO_SMTP_PORT === 465,
  auth: {
    user: config.BREVO_SMTP_USER,
    pass: config.BREVO_SMTP_KEY,
  },
});

export default transporter;
