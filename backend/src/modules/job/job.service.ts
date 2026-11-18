import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { getGeminiClient } from "../../lib/gemini";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { clearJobCandidateMatchingCache } from "../recommendation/recommendation.service";
import {
  extractMeaningfulText,
  formatMarkdownToHtml,
  sanitizeJobDescription,
} from "../../utils/sanitizeHtml";
import type {
  ICreateJobPayload,
  IGenerateJobDescriptionPayload,
  IJobFilterQuery,
  IJobResponse,
  ISingleJobDetailResponse,
  IUpdateJobPayload,
} from "./job.interface";
import JOB_MESSAGES from "./job.messages";

const createJob = async (
  companyId: string,
  payload: ICreateJobPayload,
): Promise<IJobResponse> => {
  // Validate category exists and is active
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category || category.isDeleted || !category.isActive) {
    throw new AppError(StatusCodes.NOT_FOUND, JOB_MESSAGES.CATEGORY_NOT_FOUND);
  }

  // Validate company profile exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.isDeleted || company.status === "blocked") {
    throw new AppError(StatusCodes.NOT_FOUND, JOB_MESSAGES.COMPANY_NOT_FOUND);
  }

  // Sanitize job description HTML and verify meaningful content
  const sanitizedDescription = sanitizeJobDescription(payload.description);
  const meaningfulText = extractMeaningfulText(sanitizedDescription);
  if (!meaningfulText || meaningfulText.length < 10) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Job description must contain at least 10 characters of readable text",
    );
  }

  const job = await prisma.job.create({
    data: {
      title: payload.title.trim(),
      description: sanitizedDescription,
      categoryId: payload.categoryId,
      companyId,
      location: payload.location.trim(),
      level: payload.level,
      salary: Number(payload.salary),
      vacancy: payload.vacancy ? Number(payload.vacancy) : 1,
      jobType: payload.jobType,
      hiringStatus: payload.hiringStatus || "Ongoing",
      deadline: new Date(payload.deadline),
      visible: payload.visible !== undefined ? payload.visible : true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          description: true,
          website: true,
          location: true,
          companySize: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return {
    ...job,
    applicationCount: job._count?.applications || 0,
  };
};

const getAllJobs = async (
  query: IJobFilterQuery,
): Promise<{
  data: IJobResponse[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}> => {
  const where: Prisma.JobWhereInput = {
    isDeleted: false,
  };

  // Visibility filtering
  if (query.visible !== undefined) {
    where.visible = query.visible === "true";
  } else {
    // Default to visible jobs for public queries
    where.visible = true;
  }

  // Hiring status filter (Ongoing / Closed)
  if (query.hiringStatus && query.hiringStatus !== "all") {
    where.hiringStatus = query.hiringStatus;
  }

  // Specific Company filter
  if (query.companyId) {
    where.companyId = query.companyId;
  }

  // Specific Category filter by ID
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  } else if (query.category || query.categorySlug) {
    const catIdentifier = (query.category || query.categorySlug)!.trim();
    where.category = {
      isDeleted: false,
      OR: [
        { id: catIdentifier },
        { slug: catIdentifier },
        { name: { contains: catIdentifier, mode: "insensitive" } },
      ],
    };
  }

  // Location filter
  if (query.location && query.location.trim()) {
    where.location = {
      contains: query.location.trim(),
      mode: "insensitive",
    };
  }

  // Job Type filter (supports single or comma-separated: Full-time,Remote)
  if (query.jobType && query.jobType.trim()) {
    const types = query.jobType
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (types.length === 1) {
      where.jobType = { equals: types[0], mode: "insensitive" };
    } else if (types.length > 1) {
      where.jobType = { in: types };
    }
  }

  // Experience level filter (supports single or comma-separated)
  if (query.level && query.level.trim()) {
    const levels = query.level
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    if (levels.length === 1) {
      where.level = { equals: levels[0], mode: "insensitive" };
    } else if (levels.length > 1) {
      where.level = { in: levels };
    }
  }

  // Salary Range filter
  if (query.minSalary !== undefined || query.maxSalary !== undefined) {
    where.salary = {};
    if (query.minSalary !== undefined && !isNaN(Number(query.minSalary))) {
      where.salary.gte = Number(query.minSalary);
    }
    if (query.maxSalary !== undefined && !isNaN(Number(query.maxSalary))) {
      where.salary.lte = Number(query.maxSalary);
    }
  }

  // Global Keyword Search across title, description, location, company name
  const searchTerm = (query.search || query.keyword)?.trim();
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { location: { contains: searchTerm, mode: "insensitive" } },
      { company: { name: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }

  // Sorting
  let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: "desc" };
  if (query.sortBy === "salary_desc") {
    orderBy = { salary: "desc" };
  } else if (query.sortBy === "salary_asc") {
    orderBy = { salary: "asc" };
  } else if (query.sortBy === "deadline") {
    orderBy = { deadline: "asc" };
  } else if (query.sortBy === "newest") {
    orderBy = { createdAt: "desc" };
  }

  // Pagination calculations
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            description: true,
            website: true,
            location: true,
            companySize: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    }),
    prisma.job.count({ where }),
  ]);

  const totalPage = Math.ceil(total / limit) || 1;

  return {
    data: jobs.map((job) => ({
      ...job,
      applicationCount: job._count?.applications || 0,
    })),
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

const getJobById = async (id: string): Promise<ISingleJobDetailResponse> => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          description: true,
          website: true,
          location: true,
          companySize: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!job || job.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, JOB_MESSAGES.NOT_FOUND);
  }

  // Fetch similar jobs: active jobs belonging to the same category as the currently viewed job
  const similarJobs = await prisma.job.findMany({
    where: {
      id: { not: id },
      categoryId: job.categoryId,
      isDeleted: false,
      visible: true,
      hiringStatus: "Ongoing",
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          description: true,
          website: true,
          location: true,
          companySize: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return {
    job: {
      ...job,
      applicationCount: job._count?.applications || 0,
    },
    similarJobs: similarJobs.map((j) => ({
      ...j,
      applicationCount: j._count?.applications || 0,
    })),
  };
};

const updateJob = async (
  id: string,
  user: { id: string; role: string },
  payload: IUpdateJobPayload,
): Promise<IJobResponse> => {
  const existingJob = await prisma.job.findUnique({
    where: { id },
  });

  if (!existingJob || existingJob.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, JOB_MESSAGES.NOT_FOUND);
  }

  // Recruiters can only modify their own company's jobs; Admins can modify any job
  if (user.role === "recruiter" && existingJob.companyId !== user.id) {
    throw new AppError(StatusCodes.FORBIDDEN, JOB_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  // If category changed, verify the new category
  if (payload.categoryId && payload.categoryId !== existingJob.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!category || category.isDeleted || !category.isActive) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        JOB_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }
  }

  const updateData: Prisma.JobUpdateInput = {};

  if (payload.title !== undefined) updateData.title = payload.title.trim();
  if (payload.description !== undefined) {
    const sanitizedDescription = sanitizeJobDescription(payload.description);
    const meaningfulText = extractMeaningfulText(sanitizedDescription);
    if (!meaningfulText || meaningfulText.length < 10) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Job description must contain at least 10 characters of readable text",
      );
    }
    updateData.description = sanitizedDescription;
  }
  if (payload.location !== undefined)
    updateData.location = payload.location.trim();
  if (payload.level !== undefined) updateData.level = payload.level;
  if (payload.salary !== undefined) updateData.salary = Number(payload.salary);
  if (payload.vacancy !== undefined)
    updateData.vacancy = Number(payload.vacancy);
  if (payload.jobType !== undefined) updateData.jobType = payload.jobType;
  if (payload.hiringStatus !== undefined)
    updateData.hiringStatus = payload.hiringStatus;
  if (payload.deadline !== undefined)
    updateData.deadline = new Date(payload.deadline);
  if (payload.visible !== undefined) updateData.visible = payload.visible;
  if (payload.categoryId !== undefined) {
    updateData.category = { connect: { id: payload.categoryId } };
  }
  if (payload.isDeleted !== undefined) {
    updateData.isDeleted = payload.isDeleted;
    updateData.deletedAt = payload.isDeleted ? new Date() : null;
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: updateData,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          description: true,
          website: true,
          location: true,
          companySize: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  clearJobCandidateMatchingCache(id);

  return {
    ...updatedJob,
    applicationCount: updatedJob._count?.applications || 0,
  };
};

const deleteJob = async (
  id: string,
  user: { id: string; role: string },
): Promise<IJobResponse> => {
  const existingJob = await prisma.job.findUnique({
    where: { id },
  });

  if (!existingJob || existingJob.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, JOB_MESSAGES.NOT_FOUND);
  }

  if (user.role === "recruiter" && existingJob.companyId !== user.id) {
    throw new AppError(StatusCodes.FORBIDDEN, JOB_MESSAGES.UNAUTHORIZED_ACCESS);
  }

  const deletedJob = await prisma.job.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          description: true,
          website: true,
          location: true,
          companySize: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  clearJobCandidateMatchingCache(id);

  return {
    ...deletedJob,
    applicationCount: deletedJob._count?.applications || 0,
  };
};

const getMyJobs = async (companyId: string): Promise<IJobResponse[]> => {
  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          description: true,
          website: true,
          location: true,
          companySize: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return jobs.map((job) => ({
    ...job,
    applicationCount: job._count?.applications || 0,
  }));
};

const generateDescription = async (
  payload: IGenerateJobDescriptionPayload,
): Promise<{ description: string }> => {
  const {
    title,
    categoryName,
    jobType,
    level,
    salary,
    location,
    vacancy,
    skills,
    requiredSkills,
    preferredSkills,
  } = payload;

  const llm = getGeminiClient();

  const detailsList: string[] = [`- Job Title: ${title}`];
  if (categoryName) detailsList.push(`- Job Category: ${categoryName}`);
  if (jobType) detailsList.push(`- Job Type / Employment: ${jobType}`);
  if (level) detailsList.push(`- Experience Level: ${level}`);
  if (salary && salary > 0)
    detailsList.push(`- Offered Salary: $${salary.toLocaleString()} USD/year`);
  if (location) detailsList.push(`- Work Location: ${location}`);
  if (vacancy && vacancy > 0) detailsList.push(`- Open Vacancies: ${vacancy}`);
  if (requiredSkills && requiredSkills.length > 0) {
    detailsList.push(`- Required Skills: ${requiredSkills.join(", ")}`);
  }
  if (preferredSkills && preferredSkills.length > 0) {
    detailsList.push(`- Preferred Skills: ${preferredSkills.join(", ")}`);
  }
  if (skills && skills.length > 0) {
    detailsList.push(`- Skills: ${skills.join(", ")}`);
  }

  const prompt = `You are a professional HR specialist and senior hiring expert crafting a realistic, engaging, and comprehensive job description for a job recruitment platform.

Given Job Information:
${detailsList.join("\n")}

Job Description Structure Requirements:
Include the following sections where appropriate:
1. <h3>Job Overview</h3>: A clear, engaging summary of the position, mission, and day-to-day impact.
2. <h3>Key Responsibilities</h3>: A realistic bulleted list (<ul><li>...</li></ul>) of daily duties and core deliverables appropriate for a ${level || "professional"} ${title}.
3. <h3>Required Qualifications</h3>: A bulleted list (<ul><li>...</li></ul>) of essential qualifications and core background.
4. <h3>Technical & Professional Skills</h3>: A bulleted list (<ul><li>...</li></ul>) highlighting the required skills and proficiencies.${skills || requiredSkills ? ` Incorporate: ${(requiredSkills || skills || []).join(", ")}.` : ""}
5. <h3>Preferred Qualifications</h3>: A bulleted list (<ul><li>...</li></ul>) of beneficial nice-to-have capabilities.

Writing & Formatting Rules:
- Tone: Professional, human-written, engaging, and clear.
- Relevance: Tailor strictly to "${title}" and the provided parameters.
- Do NOT invent unmentioned company perks, equity, bonuses, or unverified claims.
- Do NOT include markdown code fences (e.g., do NOT wrap with \`\`\`html or \`\`\`).
- Output clean HTML markup using <h3>, <p>, <strong>, and <ul><li> elements directly.`;

  try {
    const response = await llm.invoke(prompt);
    let rawText = "";
    if (typeof response.content === "string") {
      rawText = response.content;
    } else if (Array.isArray(response.content)) {
      rawText = response.content
        .map((p) =>
          typeof p === "string"
            ? p
            : "text" in p
              ? (p as { text: string }).text
              : "",
        )
        .join("\n");
    }

    // Strip any markdown code fences if model wrapped the output
    let cleanText = rawText
      .replace(/^```(?:html)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // If no HTML tags were generated, convert markdown format to HTML
    if (
      !cleanText.includes("<h3") &&
      !cleanText.includes("<p>") &&
      !cleanText.includes("<ul>")
    ) {
      cleanText = formatMarkdownToHtml(cleanText);
    }

    const sanitized = sanitizeJobDescription(cleanText);
    return { description: sanitized };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "AI service temporarily unavailable";
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      `Failed to generate job description: ${errorMsg}`,
    );
  }
};

const jobService = {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  generateDescription,
};

export default jobService;
