import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { deleteAsset, uploadProfilePicture } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type {
  IAdminCandidateItem,
  IAdminDashboardStats,
  IAdminJobItem,
  IAdminProfileResponse,
  IAdminRecruiterItem,
  IAdminSeedPayload,
  IAdminSeedResult,
  IChangeAdminPasswordPayload,
  IGrowthChartItem,
  IModerateJobPayload,
  IModerateUserPayload,
  IRestoreTrashPayload,
  ITrashItem,
  IUpdateAdminProfilePayload,
} from "./admin.interface";
import ADMIN_MESSAGES from "./admin.messages";

/**
 * Seeds initial Super Admin account (CLI Seeder).
 */
const seedAdmin = async (
  payload: IAdminSeedPayload,
): Promise<IAdminSeedResult> => {
  const normalizedEmail = payload.email.toLowerCase().trim();
  const trimmedName = payload.name?.trim() || "Super Admin";

  if (!normalizedEmail || !payload.password) {
    throw new Error("Admin email and password are required.");
  }

  // 1. Check if account already exists across User or Company collections
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  const existingCompany = await prisma.company.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser || existingCompany) {
    return {
      isNew: false,
      email: normalizedEmail,
      message: "Admin account already exists. No changes were made.",
      id: existingUser?.id || existingCompany?.id,
    };
  }

  // 2. Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // 3. Create the Admin using User model
  const newAdmin = await prisma.user.create({
    data: {
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      status: "active",
      isDeleted: false,
      title: "System Administrator",
      bio: "",
      skills: [],
    },
  });

  return {
    isNew: true,
    email: newAdmin.email,
    id: newAdmin.id,
    message: "Admin account created successfully.",
  };
};

/**
 * Fetches platform-wide overview statistics, 6-month growth charts,
 * category distribution, and latest activity logs.
 */
const getDashboardStats = async (): Promise<IAdminDashboardStats> => {
  const [
    totalCandidates,
    totalRecruiters,
    totalActiveJobs,
    totalApplications,
    totalHired,
    blockedUsers,
    blockedCompanies,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "candidate", isDeleted: false } }),
    prisma.company.count({ where: { isDeleted: false } }),
    prisma.job.count({
      where: { isDeleted: false, visible: true, hiringStatus: "Ongoing" },
    }),
    prisma.jobApplication.count({ where: { isDeleted: false } }),
    prisma.jobApplication.count({
      where: { isDeleted: false, status: "Accepted" },
    }),
    prisma.user.count({
      where: {
        role: "candidate",
        OR: [{ status: "blocked" }, { isDeleted: true }],
      },
    }),
    prisma.company.count({
      where: {
        OR: [{ status: "blocked" }, { isDeleted: true }],
      },
    }),
  ]);

  const totalModerated = blockedUsers + blockedCompanies;

  // Generate 6-month platform growth chart data
  const now = new Date();
  const growthChart: IGrowthChartItem[] = [];

  for (let i = 5; i >= 0; i--) {
    const year = now.getFullYear();
    const month = now.getMonth() - i;
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const [candidatesCount, recruitersCount, jobsCount] = await Promise.all([
      prisma.user.count({
        where: {
          role: "candidate",
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      prisma.company.count({
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      prisma.job.count({
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
    ]);

    const monthLabel = startOfMonth.toLocaleString("default", {
      month: "short",
    });

    growthChart.push({
      month: monthLabel,
      candidates: candidatesCount,
      recruiters: recruitersCount,
      jobs: jobsCount,
    });
  }

  // Category distribution: latest categories with at least one active job vacancy
  const categories = await prisma.category.findMany({
    where: { isDeleted: false, isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      name: true,
      _count: {
        select: {
          jobs: {
            where: { isDeleted: false, visible: true },
          },
        },
      },
    },
  });

  const categoryDistribution = categories
    .map((cat) => ({
      name: cat.name,
      count: cat._count?.jobs || 0,
    }))
    .filter((cat) => cat.count > 0)
    .slice(0, 3);

  // Recent platform activity
  const [
    recentCandidates,
    recentRecruiters,
    recentJobs,
    recentApplications,
  ] = await Promise.all([
    prisma.user.findMany({
      where: { role: "candidate", isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.company.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.job.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        hiringStatus: true,
        visible: true,
        createdAt: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.jobApplication.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        job: {
          select: {
            title: true,
          },
        },
        company: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      totalCandidates,
      totalRecruiters,
      totalActiveJobs,
      totalApplications,
      totalHired,
      totalModerated,
    },
    growthChart,
    categoryDistribution,
    recentActivity: {
      candidates: recentCandidates,
      recruiters: recentRecruiters,
      jobs: recentJobs.map((j) => ({
        id: j.id,
        title: j.title,
        companyName: j.company?.name || "Unknown Company",
        hiringStatus: j.hiringStatus,
        visible: j.visible,
        createdAt: j.createdAt,
      })),
      applications: recentApplications.map((a) => ({
        id: a.id,
        candidateName: a.user?.name || "Candidate",
        jobTitle: a.job?.title || "Job Vacancy",
        companyName: a.company?.name || "Company",
        status: a.status,
        createdAt: a.createdAt,
      })),
    },
  };
};

/**
 * Retrieves all registered candidates with search, status filtering, and application counts.
 */
const getCandidates = async (query?: {
  search?: string;
  status?: string;
  page?: string | number;
  limit?: string | number;
}): Promise<{
  candidates: IAdminCandidateItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> => {
  const page = Math.max(1, Number(query?.page) || 1);
  const limit = Math.max(1, Number(query?.limit) || 20);
  const skip = (page - 1) * limit;

  const where: {
    role: string;
    isDeleted: boolean;
    status?: string;
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      email?: { contains: string; mode: "insensitive" };
      title?: { contains: string; mode: "insensitive" };
    }>;
  } = {
    role: "candidate",
    isDeleted: false,
  };

  if (query?.status && query.status !== "all") {
    where.status = query.status;
  }

  if (query?.search && query.search.trim()) {
    const q = query.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, candidates] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        title: true,
        skills: true,
        resume: true,
        isEmailVerified: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
    }),
  ]);

  const mappedCandidates: IAdminCandidateItem[] = candidates.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    profilePicture: c.profilePicture || null,
    title: c.title,
    skills: c.skills,
    resume: c.resume ? (typeof c.resume === "string" ? c.resume : c.resume.url) : "",
    isEmailVerified: c.isEmailVerified,
    status: c.status,
    isDeleted: c.isDeleted,
    applicationCount: c._count?.applications || 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return {
    candidates: mappedCandidates,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Moderates a candidate account (Block / Unblock / Soft Delete).
 */
const moderateCandidate = async (
  candidateId: string,
  payload: IModerateUserPayload,
): Promise<IAdminCandidateItem> => {
  const candidate = await prisma.user.findFirst({
    where: { id: candidateId, role: "candidate" },
  });

  if (!candidate) {
    throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.CANDIDATE_NOT_FOUND);
  }

  const updateData: {
    status?: string;
    isDeleted?: boolean;
    deletedAt?: Date | null;
  } = {};

  if (payload.action === "block") {
    updateData.status = "blocked";
  } else if (payload.action === "unblock") {
    updateData.status = "active";
  } else if (payload.action === "delete") {
    updateData.isDeleted = true;
    updateData.deletedAt = new Date();
  }

  if (payload.status) {
    updateData.status = payload.status;
  }

  if (payload.isDeleted !== undefined) {
    updateData.isDeleted = payload.isDeleted;
    updateData.deletedAt = payload.isDeleted ? new Date() : null;
  }

  const updated = await prisma.user.update({
    where: { id: candidateId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      title: true,
      skills: true,
      resume: true,
      isEmailVerified: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    profilePicture: updated.profilePicture || null,
    title: updated.title,
    skills: updated.skills,
    resume: updated.resume
      ? typeof updated.resume === "string"
        ? updated.resume
        : updated.resume.url
      : "",
    isEmailVerified: updated.isEmailVerified,
    status: updated.status,
    isDeleted: updated.isDeleted,
    applicationCount: updated._count?.applications || 0,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};

/**
 * Retrieves all registered recruiters/companies with search, status filtering, and metrics.
 */
const getRecruiters = async (query?: {
  search?: string;
  status?: string;
  page?: string | number;
  limit?: string | number;
}): Promise<{
  recruiters: IAdminRecruiterItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> => {
  const page = Math.max(1, Number(query?.page) || 1);
  const limit = Math.max(1, Number(query?.limit) || 20);
  const skip = (page - 1) * limit;

  const where: {
    isDeleted: boolean;
    status?: string;
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      email?: { contains: string; mode: "insensitive" };
      location?: { contains: string; mode: "insensitive" };
    }>;
  } = {
    isDeleted: false,
  };

  if (query?.status && query.status !== "all") {
    where.status = query.status;
  }

  if (query?.search && query.search.trim()) {
    const q = query.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, recruiters] = await Promise.all([
    prisma.company.count({ where }),
    prisma.company.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        website: true,
        location: true,
        companySize: true,
        isEmailVerified: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: true,
            applications: true,
          },
        },
      },
    }),
  ]);

  const mappedRecruiters: IAdminRecruiterItem[] = recruiters.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    image: r.image,
    website: r.website,
    location: r.location,
    companySize: r.companySize,
    isEmailVerified: r.isEmailVerified,
    status: r.status,
    isDeleted: r.isDeleted,
    jobCount: r._count?.jobs || 0,
    applicationCount: r._count?.applications || 0,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  return {
    recruiters: mappedRecruiters,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Moderates a recruiter company account (Block / Unblock / Soft Delete).
 */
const moderateRecruiter = async (
  recruiterId: string,
  payload: IModerateUserPayload,
): Promise<IAdminRecruiterItem> => {
  const company = await prisma.company.findUnique({
    where: { id: recruiterId },
  });

  if (!company) {
    throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.RECRUITER_NOT_FOUND);
  }

  const updateData: {
    status?: string;
    isDeleted?: boolean;
    deletedAt?: Date | null;
  } = {};

  if (payload.action === "block") {
    updateData.status = "blocked";
  } else if (payload.action === "unblock") {
    updateData.status = "active";
  } else if (payload.action === "delete") {
    updateData.isDeleted = true;
    updateData.deletedAt = new Date();
  }

  if (payload.status) {
    updateData.status = payload.status;
  }

  if (payload.isDeleted !== undefined) {
    updateData.isDeleted = payload.isDeleted;
    updateData.deletedAt = payload.isDeleted ? new Date() : null;
  }

  const updated = await prisma.company.update({
    where: { id: recruiterId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      website: true,
      location: true,
      companySize: true,
      isEmailVerified: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          jobs: true,
          applications: true,
        },
      },
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    image: updated.image,
    website: updated.website,
    location: updated.location,
    companySize: updated.companySize,
    isEmailVerified: updated.isEmailVerified,
    status: updated.status,
    isDeleted: updated.isDeleted,
    jobCount: updated._count?.jobs || 0,
    applicationCount: updated._count?.applications || 0,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};

/**
 * Master query for all platform jobs with extensive filtering and company/category relations.
 */
const getAllJobs = async (query?: {
  search?: string;
  categoryId?: string;
  hiringStatus?: string;
  visible?: string;
  page?: string | number;
  limit?: string | number;
}): Promise<{
  jobs: IAdminJobItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> => {
  const page = Math.max(1, Number(query?.page) || 1);
  const limit = Math.max(1, Number(query?.limit) || 20);
  const skip = (page - 1) * limit;

  const where: {
    isDeleted: boolean;
    categoryId?: string;
    hiringStatus?: string;
    visible?: boolean;
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" };
      location?: { contains: string; mode: "insensitive" };
    }>;
  } = {
    isDeleted: false,
  };

  if (query?.categoryId && query.categoryId !== "all") {
    where.categoryId = query.categoryId;
  }

  if (query?.hiringStatus && query.hiringStatus !== "all") {
    where.hiringStatus = query.hiringStatus;
  }

  if (query?.visible !== undefined && query.visible !== "all") {
    where.visible = query.visible === "true";
  }

  if (query?.search && query.search.trim()) {
    const q = query.search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    }),
  ]);

  const mappedJobs: IAdminJobItem[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    location: j.location,
    salary: j.salary,
    jobType: j.jobType,
    level: j.level,
    hiringStatus: j.hiringStatus,
    visible: j.visible,
    isDeleted: j.isDeleted,
    deadline: j.deadline,
    createdAt: j.createdAt,
    company: j.company,
    category: j.category,
    applicationCount: j._count?.applications || 0,
  }));

  return {
    jobs: mappedJobs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Moderates a job vacancy (Toggle visibility, update hiring status, or soft-delete).
 */
const moderateJob = async (
  jobId: string,
  payload: IModerateJobPayload,
): Promise<IAdminJobItem> => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.JOB_NOT_FOUND);
  }

  const updateData: {
    visible?: boolean;
    hiringStatus?: string;
    isDeleted?: boolean;
    deletedAt?: Date | null;
  } = {};

  if (payload.visible !== undefined) {
    updateData.visible = payload.visible;
  }

  if (payload.hiringStatus) {
    updateData.hiringStatus = payload.hiringStatus;
  }

  if (payload.isDeleted !== undefined) {
    updateData.isDeleted = payload.isDeleted;
    updateData.deletedAt = payload.isDeleted ? new Date() : null;
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: updateData,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
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
    id: updated.id,
    title: updated.title,
    location: updated.location,
    salary: updated.salary,
    jobType: updated.jobType,
    level: updated.level,
    hiringStatus: updated.hiringStatus,
    visible: updated.visible,
    isDeleted: updated.isDeleted,
    deadline: updated.deadline,
    createdAt: updated.createdAt,
    company: updated.company,
    category: updated.category,
    applicationCount: updated._count?.applications || 0,
  };
};

/**
 * Centralized Trash Center: Retrieves all soft-deleted records (isDeleted: true)
 * across Candidates, Recruiters, Jobs, and Categories.
 */
const getTrashItems = async (query?: {
  type?: string;
}): Promise<ITrashItem[]> => {
  const targetType = query?.type || "all";
  const trashItems: ITrashItem[] = [];

  const fetchCandidates = targetType === "all" || targetType === "candidate";
  const fetchRecruiters = targetType === "all" || targetType === "recruiter";
  const fetchJobs = targetType === "all" || targetType === "job";
  const fetchCategories = targetType === "all" || targetType === "category";

  const [
    deletedCandidates,
    deletedRecruiters,
    deletedJobs,
    deletedCategories,
  ] = await Promise.all([
    fetchCandidates
      ? prisma.user.findMany({
          where: { role: "candidate", isDeleted: true },
          select: {
            id: true,
            name: true,
            email: true,
            title: true,
            deletedAt: true,
          },
        })
      : [],
    fetchRecruiters
      ? prisma.company.findMany({
          where: { isDeleted: true },
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            deletedAt: true,
          },
        })
      : [],
    fetchJobs
      ? prisma.job.findMany({
          where: { isDeleted: true },
          select: {
            id: true,
            title: true,
            location: true,
            deletedAt: true,
            company: { select: { name: true } },
          },
        })
      : [],
    fetchCategories
      ? prisma.category.findMany({
          where: { isDeleted: true },
          select: {
            id: true,
            name: true,
            slug: true,
            deletedAt: true,
          },
        })
      : [],
  ]);

  deletedCandidates.forEach((c) => {
    trashItems.push({
      id: c.id,
      type: "candidate",
      title: c.name,
      subtitle: c.email + (c.title ? ` • ${c.title}` : ""),
      deletedAt: c.deletedAt,
    });
  });

  deletedRecruiters.forEach((r) => {
    trashItems.push({
      id: r.id,
      type: "recruiter",
      title: r.name,
      subtitle: r.email + (r.location ? ` • ${r.location}` : ""),
      deletedAt: r.deletedAt,
    });
  });

  deletedJobs.forEach((j) => {
    trashItems.push({
      id: j.id,
      type: "job",
      title: j.title,
      subtitle: (j.company?.name || "Company") + ` • ${j.location}`,
      deletedAt: j.deletedAt,
    });
  });

  deletedCategories.forEach((cat) => {
    trashItems.push({
      id: cat.id,
      type: "category",
      title: cat.name,
      subtitle: `Slug: /${cat.slug}`,
      deletedAt: cat.deletedAt,
    });
  });

  // Sort by deletion date descending
  return trashItems.sort((a, b) => {
    const timeA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
    const timeB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
    return timeB - timeA;
  });
};

/**
 * Restores a soft-deleted entity from the Trash Center in 1 click.
 */
const restoreTrashItem = async (
  payload: IRestoreTrashPayload,
): Promise<{ success: boolean; message: string }> => {
  const { type, id } = payload;

  switch (type) {
    case "candidate": {
      const candidate = await prisma.user.findFirst({
        where: { id, role: "candidate" },
      });
      if (!candidate) {
        throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.CANDIDATE_NOT_FOUND);
      }
      await prisma.user.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null },
      });
      return { success: true, message: `Candidate "${candidate.name}" restored successfully.` };
    }

    case "recruiter": {
      const company = await prisma.company.findUnique({
        where: { id },
      });
      if (!company) {
        throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.RECRUITER_NOT_FOUND);
      }
      await prisma.company.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null },
      });
      return { success: true, message: `Recruiter "${company.name}" restored successfully.` };
    }

    case "job": {
      const job = await prisma.job.findUnique({
        where: { id },
      });
      if (!job) {
        throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.JOB_NOT_FOUND);
      }
      await prisma.job.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null },
      });
      return { success: true, message: `Job "${job.title}" restored successfully.` };
    }

    case "category": {
      const category = await prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new AppError(StatusCodes.NOT_FOUND, "Category not found in database.");
      }
      await prisma.category.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null },
      });
      return { success: true, message: `Category "${category.name}" restored successfully.` };
    }

    default:
      throw new AppError(StatusCodes.BAD_REQUEST, ADMIN_MESSAGES.INVALID_ENTITY_TYPE);
  }
};

/**
 * Permanently purges a record from the database.
 */
const permanentlyDeleteTrashItem = async (
  type: string,
  id: string,
): Promise<{ success: boolean; message: string }> => {
  switch (type) {
    case "candidate":
      await prisma.user.delete({ where: { id } });
      break;
    case "recruiter":
      await prisma.company.delete({ where: { id } });
      break;
    case "job":
      await prisma.job.delete({ where: { id } });
      break;
    case "category":
      await prisma.category.delete({ where: { id } });
      break;
    default:
      throw new AppError(StatusCodes.BAD_REQUEST, ADMIN_MESSAGES.INVALID_ENTITY_TYPE);
  }

  return { success: true, message: "Record permanently purged from database." };
};

/**
 * Retrieves the authenticated Admin user profile (excluding password).
 */
const getAdminProfile = async (
  adminId: string,
): Promise<IAdminProfileResponse> => {
  const admin = await prisma.user.findFirst({
    where: {
      id: adminId,
      role: "admin",
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isEmailVerified: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.ADMIN_NOT_FOUND);
  }

  return {
    ...admin,
    profilePicture: admin.profilePicture || null,
    profileImage: admin.profilePicture || null,
  };
};

/**
 * Updates Admin user name, email, and/or profile picture in Cloudinary.
 * Strictly prevents role, status, or unauthorized field updates.
 */
const updateAdminProfile = async (
  adminId: string,
  payload: IUpdateAdminProfilePayload,
  file?: Express.Multer.File,
): Promise<IAdminProfileResponse> => {
  const admin = await prisma.user.findFirst({
    where: {
      id: adminId,
      role: "admin",
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isEmailVerified: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.ADMIN_NOT_FOUND);
  }

  const updateData: {
    name?: string;
    email?: string;
    profilePicture?: { url: string; publicId: string } | null;
  } = {};

  if (payload.name !== undefined) {
    const trimmedName = payload.name.trim();
    if (trimmedName) {
      updateData.name = trimmedName;
    }
  }

  if (payload.email !== undefined) {
    const normalizedEmail = payload.email.toLowerCase().trim();
    if (normalizedEmail && normalizedEmail !== admin.email.toLowerCase()) {
      // Ensure email is unique across User (other than this admin) and Company
      const existingUser = await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          id: { not: adminId },
        },
      });

      const existingCompany = await prisma.company.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingUser || existingCompany) {
        throw new AppError(
          StatusCodes.CONFLICT,
          ADMIN_MESSAGES.EMAIL_ALREADY_IN_USE,
        );
      }

      updateData.email = normalizedEmail;
    }
  }

  // Handle image removal request if requested
  const isRemovalRequested =
    payload.removeProfileImage === true ||
    payload.removeProfileImage === "true";

  if (isRemovalRequested && !file) {
    if (admin.profilePicture?.publicId) {
      await deleteAsset(admin.profilePicture.publicId, "image").catch((err) =>
        console.error("Cloudinary profile picture deletion error:", err),
      );
    }
    updateData.profilePicture = null;
  }

  // Handle new image upload to Cloudinary if file provided
  let newProfilePicture: { url: string; publicId: string } | null = null;
  if (file) {
    const validMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validMimes.includes(file.mimetype.toLowerCase())) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        ADMIN_MESSAGES.INVALID_IMAGE_FILE,
      );
    }

    const uploadRes = await uploadProfilePicture(file, {
      folder: "Superio/profile-pictures",
    });

    newProfilePicture = {
      url: uploadRes.url,
      publicId: uploadRes.publicId,
    };
    updateData.profilePicture = newProfilePicture;
  }

  // If no fields changed and no file uploaded/removed, return existing profile
  if (Object.keys(updateData).length === 0) {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      isEmailVerified: admin.isEmailVerified,
      profilePicture: admin.profilePicture || null,
      profileImage: admin.profilePicture || null,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  let updatedAdmin;
  try {
    updatedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isEmailVerified: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (dbError) {
    // If DB update fails, clean up the newly uploaded asset immediately to avoid orphan
    if (newProfilePicture?.publicId) {
      await deleteAsset(newProfilePicture.publicId, "image").catch((err) =>
        console.error("Cleanup error for newly uploaded admin avatar:", err),
      );
    }
    throw dbError;
  }

  // Database update succeeded: safely delete previous image if replaced
  if (newProfilePicture && admin.profilePicture?.publicId) {
    await deleteAsset(admin.profilePicture.publicId, "image").catch((err) =>
      console.error(
        `Failed to delete previous admin avatar [${admin.profilePicture?.publicId}]:`,
        err,
      ),
    );
  }

  return {
    ...updatedAdmin,
    profilePicture: updatedAdmin.profilePicture || null,
    profileImage: updatedAdmin.profilePicture || null,
  };
};

/**
 * Uploads or updates Admin profile image directly in Cloudinary.
 */
const uploadAdminProfileImage = async (
  adminId: string,
  file: Express.Multer.File,
): Promise<IAdminProfileResponse> => {
  if (!file) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      ADMIN_MESSAGES.PROFILE_IMAGE_REQUIRED,
    );
  }
  return updateAdminProfile(adminId, {}, file);
};

/**
 * Removes Admin profile image from Cloudinary and clears database fields.
 */
const removeAdminProfileImage = async (
  adminId: string,
): Promise<IAdminProfileResponse> => {
  return updateAdminProfile(adminId, { removeProfileImage: true });
};

/**
 * Changes authenticated Admin password securely using bcrypt verification and hashing.
 */
const changeAdminPassword = async (
  adminId: string,
  payload: IChangeAdminPasswordPayload,
): Promise<{ message: string }> => {
  const admin = await prisma.user.findFirst({
    where: {
      id: adminId,
      role: "admin",
      isDeleted: false,
    },
  });

  if (!admin) {
    throw new AppError(StatusCodes.NOT_FOUND, ADMIN_MESSAGES.ADMIN_NOT_FOUND);
  }

  // Verify current password with bcrypt
  const isCurrentPasswordValid = await bcrypt.compare(
    payload.currentPassword,
    admin.password,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      ADMIN_MESSAGES.CURRENT_PASSWORD_INCORRECT,
    );
  }

  if (payload.newPassword !== payload.confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      ADMIN_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    );
  }

  // Hash new password with 10 salt rounds
  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: { id: adminId },
    data: {
      password: hashedNewPassword,
    },
  });

  return { message: ADMIN_MESSAGES.ADMIN_PASSWORD_CHANGED };
};

const adminService = {
  seedAdmin,
  getDashboardStats,
  getCandidates,
  moderateCandidate,
  getRecruiters,
  moderateRecruiter,
  getAllJobs,
  moderateJob,
  getTrashItems,
  restoreTrashItem,
  permanentlyDeleteTrashItem,
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfileImage,
  removeAdminProfileImage,
  changeAdminPassword,
};

export default adminService;
