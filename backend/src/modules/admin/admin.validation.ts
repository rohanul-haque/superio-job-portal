import { z } from "zod";

const moderateUserValidationSchema = z.object({
  body: z.object({
    action: z.enum(["block", "unblock", "delete"]).optional(),
    status: z.enum(["active", "blocked"]).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const moderateJobValidationSchema = z.object({
  body: z.object({
    visible: z.boolean().optional(),
    hiringStatus: z.enum(["Ongoing", "Closed"]).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const restoreTrashValidationSchema = z.object({
  body: z.object({
    type: z.enum(["candidate", "recruiter", "job", "category"], {
      required_error: "Entity type is required (candidate, recruiter, job, category)",
    }),
    id: z.string({
      required_error: "Entity ID is required",
    }),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ invalid_type_error: "Name must be a string" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    email: z
      .string({ invalid_type_error: "Email must be a string" })
      .trim()
      .email("Invalid email address format")
      .optional(),
    removeProfileImage: z.union([z.boolean(), z.string()]).optional(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string({ required_error: "Current password is required" })
        .min(1, "Current password is required"),
      newPassword: z
        .string({ required_error: "New password is required" })
        .min(6, "New password must be at least 6 characters"),
      confirmPassword: z
        .string({ required_error: "Confirm password is required" })
        .min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "New password and confirm password do not match",
      path: ["confirmPassword"],
    }),
});

const adminValidation = {
  moderateUserValidationSchema,
  moderateJobValidationSchema,
  restoreTrashValidationSchema,
  updateProfileValidationSchema,
  changePasswordValidationSchema,
};

export default adminValidation;

