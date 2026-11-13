import { z } from "zod";

const updateCompanyProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Company name must be at least 2 characters").max(100).optional(),
    description: z.string().trim().max(3000).optional(),
    website: z.string().trim().optional(),
    location: z.string().trim().max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    socialLinks: z.union([z.record(z.string(), z.string().optional()), z.string()]).optional(),
  }),
});

const updateApplicantStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["Pending", "Shortlisted", "Accepted", "Rejected", "Withdrawn"], {
      required_error: "Application status is required",
    }),
  }),
});

const recruiterValidation = {
  updateCompanyProfileValidationSchema,
  updateApplicantStatusValidationSchema,
};

export default recruiterValidation;

