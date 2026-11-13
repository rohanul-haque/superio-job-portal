import { StatusCodes } from "http-status-codes";
import { uploadImage } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type {
  ICompanyProfileResponse,
  IRecruiterApplicantResponse,
  IRecruiterDashboardStatsResponse,
  IUpdateCompanyProfilePayload,
} from "./recruiter.interface";
import RECRUITER_MESSAGES from "./recruiter.messages";

/**
 * Retrieves the recruiter's company profile.
 */
const getProfile = async (
  companyId: string,
): Promise<ICompanyProfileResponse> => {
  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      description: true,
      website: true,
      location: true,
      companySize: true,
      socialLinks: true,
      isEmailVerified: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!company) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      RECRUITER_MESSAGES.COMPANY_NOT_FOUND,
    );
  }

  return {
    ...company,
    socialLinks: (company.socialLinks as Record<string, string>) || null,
  };
};

/**
 * Updates company profile details and logo in Cloudinary.
 */
const updateProfile = async (
  companyId: string,
  payload: IUpdateCompanyProfilePayload,
  file?: Express.Multer.File,
): Promise<ICompanyProfileResponse> => {
  const existing = await prisma.company.findFirst({
    where: { id: companyId, isDeleted: false },
  });

  if (!existing) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      RECRUITER_MESSAGES.COMPANY_NOT_FOUND,
    );
  }

  const updateData: {
    name?: string;
    description?: string;
    website?: string;
    location?: string;
    companySize?: string;
    socialLinks?: any;
    image?: string;
  } = {};

  if (payload.name && payload.name.trim()) {
    updateData.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    updateData.description = payload.description.trim();
  }

  if (payload.website !== undefined) {
    updateData.website = payload.website.trim();
  }

  if (payload.location !== undefined) {
    updateData.location = payload.location.trim();
  }

  if (payload.companySize !== undefined) {
    updateData.companySize = payload.companySize.trim();
  }

  if (payload.socialLinks !== undefined) {
    if (
      typeof payload.socialLinks === "object" &&
      payload.socialLinks !== null
    ) {
      updateData.socialLinks = payload.socialLinks;
    } else if (typeof payload.socialLinks === "string") {
      try {
        updateData.socialLinks = JSON.parse(payload.socialLinks);
      } catch {
        updateData.socialLinks = {};
      }
    }
  }

  // Handle Logo image upload
  if (file) {
    const uploadRes = await uploadImage(file, {
      folder: "Superio/companies/logos",
    });
    updateData.image = uploadRes.url;
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      description: true,
      website: true,
      location: true,
      companySize: true,
      socialLinks: true,
      isEmailVerified: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    ...updatedCompany,
    socialLinks: (updatedCompany.socialLinks as Record<string, string>) || null,
  };
};

/**
 * Computes Recruiter Dashboard statistics:
 * 1. 5 summary cards (Total Jobs Posted, Ongoing, Closed, Total Applicants, Hired)
 * 2. Applicant Inflow time-series Area Chart (last 6 months)
 * 3. Recent 5 applicants snapshot
 */
const getDashboardStats = async (
  companyId: string,
): Promise<IRecruiterDashboardStatsResponse> => {
  const [jobs, applications] = await Promise.all([
    prisma.job.findMany({
      where: { companyId, isDeleted: false },
      select: {
        id: true,
        hiringStatus: true,
      },
    }),
    prisma.jobApplication.findMany({
      where: { companyId, isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            title: true,
            resume: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
  ]);

  const stats = {
    totalJobsPosted: jobs.length,
    ongoingJobs: jobs.filter((j) => j.hiringStatus === "Ongoing").length,
    closedJobs: jobs.filter((j) => j.hiringStatus === "Closed").length,
    totalApplicants: applications.length,
    hiredCandidates: applications.filter((a) => a.status === "Accepted").length,
  };

  // Inflow Chart: Last 6 months aggregate
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const inflowChart: Array<{ date: string; applications: number }> = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const count = applications.filter((app) => {
      const appDate = new Date(app.createdAt);
      return appDate >= monthStart && appDate <= monthEnd;
    }).length;

    inflowChart.push({
      date: monthLabel,
      applications: count,
    });
  }

  // Top 5 Recent Applicants
  const recentApplicants = applications.slice(0, 5).map((app) => ({
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    candidate: {
      ...app.user,
      resume: app.user.resume?.url || "",
    },
    job: app.job,
  }));

  return {
    stats,
    inflowChart,
    recentApplicants,
  };
};

/**
 * Retrieves all applicants across the company's posted jobs with candidate profile data.
 */
const getApplicants = async (
  companyId: string,
  query?: { jobId?: string; status?: string },
): Promise<IRecruiterApplicantResponse[]> => {
  const where: {
    companyId: string;
    isDeleted: boolean;
    jobId?: string;
    status?: string;
  } = {
    companyId,
    isDeleted: false,
  };

  if (query?.jobId && query.jobId.trim() && query.jobId !== "all") {
    where.jobId = query.jobId.trim();
  }

  if (query?.status && query.status.trim() && query.status !== "all") {
    where.status = query.status.trim();
  }

  const applications = await prisma.jobApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
          title: true,
          bio: true,
          skills: true,
          socialLinks: true,
          resume: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          hiringStatus: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return applications.map((app) => ({
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
    candidate: {
      ...app.user,
      resume: app.user.resume?.url || "",
      socialLinks: (app.user.socialLinks as Record<string, string>) || null,
    },
    job: app.job,
  }));
};

/**
 * Mutates applicant status (Shortlisted, Accepted, Rejected).
 */
const updateApplicantStatus = async (
  companyId: string,
  applicationId: string,
  status: string,
): Promise<IRecruiterApplicantResponse> => {
  const existing = await prisma.jobApplication.findFirst({
    where: {
      id: applicationId,
      companyId,
      isDeleted: false,
    },
  });

  if (!existing) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      RECRUITER_MESSAGES.APPLICATION_NOT_FOUND,
    );
  }

  const updated = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
          title: true,
          bio: true,
          skills: true,
          socialLinks: true,
          resume: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          hiringStatus: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    id: updated.id,
    status: updated.status,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    candidate: {
      ...updated.user,
      resume: updated.user.resume?.url || "",
      socialLinks: (updated.user.socialLinks as Record<string, string>) || null,
    },
    job: updated.job,
  };
};

const recruiterService = {
  getProfile,
  updateProfile,
  getDashboardStats,
  getApplicants,
  updateApplicantStatus,
};

export default recruiterService;
