import { z } from "zod";

const candidateRegisterValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Full name is required" })
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    title: z.string().optional(),
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
  }),
});

const recruiterRegisterValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Company name is required" })
      .min(2, "Company name must be at least 2 characters"),
    email: z
      .string({ required_error: "Work email is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    location: z.string().optional(),
    companySize: z.string().optional(),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    description: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
    role: z.enum(["candidate", "recruiter", "admin"]).optional(),
  }),
});

const verifyEmailCredentialsValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  }),
});

const resendVerificationValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
  }),
});

const refreshTokenValidationSchema = z
  .object({
    cookies: z
      .object({
        refreshToken: z.string({
          required_error: "Refresh token is missing from cookies",
        }),
      })
      .optional(),
  })
  .passthrough();

const authValidation = {
  candidateRegisterValidationSchema,
  recruiterRegisterValidationSchema,
  loginValidationSchema,
  verifyEmailCredentialsValidationSchema,
  resendVerificationValidationSchema,
  refreshTokenValidationSchema,
};

export default authValidation;
