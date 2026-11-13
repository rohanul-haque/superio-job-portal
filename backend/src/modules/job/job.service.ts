import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  extractMeaningfulText,
  sanitizeJobDescription,
} from "../../utils/sanitizeHtml";
import type {
  ICreateJobPayload,
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

  // Fetch similar jobs (up to 4 active jobs from the same category or company)
  const similarJobs = await prisma.job.findMany({
    where: {
      id: { not: id },
      isDeleted: false,
      visible: true,
      hiringStatus: "Ongoing",
      OR: [{ categoryId: job.categoryId }, { companyId: job.companyId }],
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

const jobService = {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
};

export default jobService;
