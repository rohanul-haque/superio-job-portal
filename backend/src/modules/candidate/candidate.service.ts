import { StatusCodes } from "http-status-codes";
import {
  deleteAsset,
  uploadProfilePicture,
  uploadResumeDocument,
} from "../../lib/cloudinary";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type {
  ICandidateDashboardStatsResponse,
  ICandidateProfileResponse,
  ICloudinaryFile,
  IUpdateCandidateProfilePayload,
} from "./candidate.interface";
import CANDIDATE_MESSAGES from "./candidate.messages";

/**
 * Retrieves the full candidate profile by ID.
 */
const getProfile = async (
  candidateId: string,
): Promise<ICandidateProfileResponse> => {
  const user = await prisma.user.findFirst({
    where: {
      id: candidateId,
      role: "candidate",
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
      title: true,
      bio: true,
      skills: true,
      socialLinks: true,
      resume: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      CANDIDATE_MESSAGES.CANDIDATE_NOT_FOUND,
    );
  }

  return {
    ...user,
    socialLinks: (user.socialLinks as Record<string, string>) || null,
  };
};

/**
 * Updates candidate profile, avatar image, and Cloudinary PDF resume.
 */
const updateProfile = async (
  candidateId: string,
  payload: IUpdateCandidateProfilePayload,
  files?: { [fieldname: string]: Express.Multer.File[] },
): Promise<ICandidateProfileResponse> => {
  const user = await prisma.user.findFirst({
    where: {
      id: candidateId,
      role: "candidate",
      isDeleted: false,
    },
    select: {
      id: true,
      profilePicture: true,
      resume: true,
    },
  });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      CANDIDATE_MESSAGES.CANDIDATE_NOT_FOUND,
    );
  }

  const updateData: {
    name?: string;
    title?: string;
    bio?: string;
    skills?: string[];
    socialLinks?: any;
    profilePicture?: ICloudinaryFile;
    resume?: ICloudinaryFile;
  } = {};

  if (payload.name && payload.name.trim()) {
    updateData.name = payload.name.trim();
  }

  if (payload.title !== undefined) {
    updateData.title = payload.title.trim();
  }

  if (payload.bio !== undefined) {
    updateData.bio = payload.bio.trim();
  }

  // Parse skills
  if (payload.skills !== undefined) {
    if (Array.isArray(payload.skills)) {
      updateData.skills = payload.skills
        .map((s) => String(s).trim())
        .filter(Boolean);
    } else if (typeof payload.skills === "string") {
      try {
        const parsed = JSON.parse(payload.skills);
        if (Array.isArray(parsed)) {
          updateData.skills = parsed
            .map((s) => String(s).trim())
            .filter(Boolean);
        } else {
          updateData.skills = payload.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } catch {
        updateData.skills = payload.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  }

  // Parse socialLinks
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

  // Handle Profile Picture upload to Cloudinary
  let newProfilePicture: ICloudinaryFile | null = null;
  const imageFile = files?.profilePicture?.[0];

  if (imageFile) {
    const validMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validMimes.includes(imageFile.mimetype.toLowerCase())) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Profile photo must be a valid image (JPEG, JPG, PNG, or WEBP).",
      );
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Profile photo exceeds the 5 MB file size limit.",
      );
    }

    const uploadRes = await uploadProfilePicture(imageFile, {
      folder: "Superio/profile-pictures",
    });
    newProfilePicture = {
      url: uploadRes.url,
      publicId: uploadRes.publicId,
    };
    updateData.profilePicture = newProfilePicture;
  }

  // Handle PDF Resume upload to Cloudinary
  let newResume: ICloudinaryFile | null = null;
  const resumeFile = files?.resume?.[0];

  if (resumeFile) {
    if (resumeFile.mimetype.toLowerCase() !== "application/pdf") {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Resume must be a PDF document (application/pdf).",
      );
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Resume document exceeds the 5 MB file size limit.",
      );
    }
    // PDF Magic Bytes validation (%PDF-)
    if (resumeFile.buffer && resumeFile.buffer.length >= 5) {
      const header = resumeFile.buffer.subarray(0, 5).toString("utf-8");
      if (!header.startsWith("%PDF-")) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Invalid PDF document format. Header verification failed.",
        );
      }
    }

    const uploadRes = await uploadResumeDocument(resumeFile, {
      folder: "Superio/resumes",
    });
    newResume = {
      url: uploadRes.url,
      publicId: uploadRes.publicId,
    };
    updateData.resume = newResume;
  }

  let updatedUser;
  try {
    updatedUser = await prisma.user.update({
      where: { id: candidateId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicture: true,
        title: true,
        bio: true,
        skills: true,
        socialLinks: true,
        resume: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (dbError) {
    // If DB update fails, immediately clean up newly uploaded assets
    if (newProfilePicture?.publicId) {
      await deleteAsset(newProfilePicture.publicId, "image").catch((err) =>
        console.error("Cleanup error for new profile picture:", err),
      );
    }
    if (newResume?.publicId) {
      await deleteAsset(newResume.publicId, "raw").catch((err) =>
        console.error("Cleanup error for new resume:", err),
      );
    }
    throw dbError;
  }

  // Database update succeeded: safely delete previous assets if they have valid public IDs
  if (newProfilePicture && user.profilePicture?.publicId) {
    await deleteAsset(user.profilePicture.publicId, "image").catch((err) =>
      console.error(
        `Failed to delete previous profile picture [${user.profilePicture?.publicId}]:`,
        err,
      ),
    );
  }

  if (newResume && user.resume?.publicId) {
    await deleteAsset(user.resume.publicId, "raw").catch((err) =>
      console.error(
        `Failed to delete previous resume [${user.resume?.publicId}]:`,
        err,
      ),
    );
  }

  return {
    ...updatedUser,
    socialLinks: (updatedUser.socialLinks as Record<string, string>) || null,
  };
};

/**
 * Generates Candidate Dashboard analytics, 5 stat cards, and Area Chart time-series data.
 */
const getDashboardStats = async (
  candidateId: string,
): Promise<ICandidateDashboardStatsResponse> => {
  const applications = await prisma.jobApplication.findMany({
    where: {
      userId: candidateId,
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          jobType: true,
          salary: true,
          hiringStatus: true,
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

  // 1. Calculate 5 Stat Cards
  const stats = {
    totalApplied: applications.length,
    pending: applications.filter((a) => a.status === "Pending").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    accepted: applications.filter((a) => a.status === "Accepted").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  // 2. Generate Application Activity Area Chart data (last 6 months with real aggregate counts)
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
  const activityChart: Array<{ date: string; applications: number }> = [];

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

    activityChart.push({
      date: monthLabel,
      applications: count,
    });
  }

  // 3. Top 5 Recent Applications
  const recentApplications = applications.slice(0, 5).map((app) => ({
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    job: app.job,
    company: app.company,
  }));

  return {
    stats,
    activityChart,
    recentApplications,
  };
};

const candidateService = {
  getProfile,
  updateProfile,
  getDashboardStats,
};

export default candidateService;
