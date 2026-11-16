import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  BREVO_SMTP_PORT: Number(process.env.BREVO_SMTP_PORT) || 587,
  BREVO_SMTP_USER: process.env.BREVO_SMTP_USER,
  BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY,
  BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL,
  BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || "HireNest",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

  JWT_EMAIL_VERIFICATION_SECRET: process.env.JWT_EMAIL_VERIFICATION_SECRET,
  JWT_EMAIL_VERIFICATION_EXPIRES_IN:
    process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN,

  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default config;
