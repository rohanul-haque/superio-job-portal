import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type {
  IApplicationResponse,
  IMyApplicationsQuery,
} from "./application.interface";
import APPLICATION_MESSAGES from "./application.messages";

/**
 * Submits a new job application enforcing:
 * 1. Resume Guard (blocks if candidate.resume is missing/empty)
 * 2. Active Job validation (Ongoing and visible)
 * 3. Compound unique index duplicate prevention
 */
const applyJob = async (
  candidateId: string,
  jobId: string,
): Promise<IApplicationResponse> => {
  // 1. Resume Guard: Candidate must have an uploaded resume
  const candidate = await prisma.user.findFirst({
    where: {
      id: candidateId,
      role: "candidate",
      isDeleted: false,
    },
    select: {
      id: true,
      resume: true,
    },
  });

  if (!candidate) {
    throw new AppError(StatusCodes.NOT_FOUND, "Candidate profile not found.");
  }

  if (
    !candidate.resume ||
    !candidate.resume.url ||
    candidate.resume.url.trim() === ""
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      APPLICATION_MESSAGES.RESUME_REQUIRED,
    );
  }

  // 2. Validate Job status and availability
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      isDeleted: false,
      visible: true,
    },
  });

  if (!job) {
    throw new AppError(StatusCodes.NOT_FOUND, APPLICATION_MESSAGES.JOB_NOT_FOUND);
  }

  if (job.hiringStatus !== "Ongoing") {
    throw new AppError(StatusCodes.BAD_REQUEST, APPLICATION_MESSAGES.JOB_CLOSED);
  }

  // 3. Prevent duplicate applications via compound unique index
  const existingApplication = await prisma.jobApplication.findUnique({
    where: {
      userId_jobId: {
        userId: candidateId,
        jobId,
      },
    },
  });

  if (existingApplication) {
    throw new AppError(
      StatusCodes.CONFLICT,
      APPLICATION_MESSAGES.ALREADY_APPLIED,
    );
  }

  // 4. Create the application
  const application = await prisma.jobApplication.create({
    data: {
      userId: candidateId,
      jobId,
      companyId: job.companyId,
      status: "Pending",
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          salary: true,
          jobType: true,
          hiringStatus: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          image: true,
          location: true,
        },
      },
    },
  });

  return application;
};

/**
 * Retrieves all applications submitted by the current candidate.
 */
const getMyApplications = async (
  candidateId: string,
  query?: IMyApplicationsQuery,
): Promise<IApplicationResponse[]> => {
  const where: {
    userId: string;
    isDeleted: boolean;
    status?: string;
  } = {
    userId: candidateId,
    isDeleted: false,
  };

  if (query?.status && query.status.trim() && query.status !== "all") {
    where.status = query.status.trim();
  }

  const applications = await prisma.jobApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          salary: true,
          jobType: true,
          hiringStatus: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          image: true,
          location: true,
        },
      },
    },
  });

  return applications;
};

/**
 * Withdraws a Pending application.
 */
const withdrawApplication = async (
  candidateId: string,
  applicationId: string,
): Promise<IApplicationResponse> => {
  const application = await prisma.jobApplication.findFirst({
    where: {
      id: applicationId,
      userId: candidateId,
      isDeleted: false,
    },
  });

  if (!application) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      APPLICATION_MESSAGES.APPLICATION_NOT_FOUND,
    );
  }

  if (application.status !== "Pending") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `${APPLICATION_MESSAGES.CANNOT_WITHDRAW_NON_PENDING}. Current status: ${application.status}`,
    );
  }

  const updated = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status: "Withdrawn",
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          salary: true,
          jobType: true,
          hiringStatus: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          image: true,
          location: true,
        },
      },
    },
  });

  return updated;
};

const applicationService = {
  applyJob,
  getMyApplications,
  withdrawApplication,
};

export default applicationService;

