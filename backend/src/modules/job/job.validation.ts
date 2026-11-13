import { z } from "zod";
import { extractMeaningfulText } from "../../utils/sanitizeHtml";

const createJobValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Job title is required" })
      .trim()
      .min(3, "Job title must be at least 3 characters"),
    description: z
      .string({ required_error: "Job description is required" })
      .trim()
      .refine(
        (val) => extractMeaningfulText(val).length >= 10,
        "Job description must contain at least 10 characters of readable text",
      ),
    categoryId: z
      .string({ required_error: "Job category is required" })
      .trim()
      .min(1, "Category ID is required"),
    location: z
      .string({ required_error: "Location is required" })
      .trim()
      .min(2, "Location must be at least 2 characters"),
    level: z.enum(
      ["Beginner level", "Intermediate level", "Senior level"],
      {
        errorMap: () => ({
          message:
            "Experience level must be 'Beginner level', 'Intermediate level', or 'Senior level'",
        }),
      },
    ),
    salary: z
      .number({ required_error: "Salary is required" })
      .min(0, "Salary cannot be negative"),
    vacancy: z
      .number()
      .int("Vacancy must be an integer")
      .min(1, "Vacancy must be at least 1")
      .optional()
      .default(1),
    jobType: z.enum(
      ["Full-time", "Part-time", "Remote", "Contract", "Internship"],
      {
        errorMap: () => ({
          message:
            "Job type must be 'Full-time', 'Part-time', 'Remote', 'Contract', or 'Internship'",
        }),
      },
    ),
    hiringStatus: z
      .enum(["Ongoing", "Closed"], {
        errorMap: () => ({
          message: "Hiring status must be 'Ongoing' or 'Closed'",
        }),
      })
      .optional()
      .default("Ongoing"),
    deadline: z
      .string({ required_error: "Application deadline is required" })
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Deadline must be a valid ISO date string",
      ),
    visible: z.boolean().optional().default(true),
  }),
});

const updateJobValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).optional(),
    description: z
      .string()
      .trim()
      .refine(
        (val) => !val || extractMeaningfulText(val).length >= 10,
        "Job description must contain at least 10 characters of readable text",
      )
      .optional(),
    categoryId: z.string().trim().optional(),
    location: z.string().trim().min(2).optional(),
    level: z
      .enum(["Beginner level", "Intermediate level", "Senior level"])
      .optional(),
    salary: z.number().min(0).optional(),
    vacancy: z.number().int().min(1).optional(),
    jobType: z
      .enum(["Full-time", "Part-time", "Remote", "Contract", "Internship"])
      .optional(),
    hiringStatus: z.enum(["Ongoing", "Closed"]).optional(),
    deadline: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid ISO date string")
      .optional(),
    visible: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const jobValidation = {
  createJobValidationSchema,
  updateJobValidationSchema,
};

export default jobValidation;

