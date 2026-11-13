import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type { IBookmarkResponse } from "./bookmark.interface";

/**
 * Toggles a job bookmark for a candidate.
 */
const toggleBookmark = async (
  userId: string,
  jobId: string,
): Promise<{ isBookmarked: boolean; message: string }> => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, isDeleted: false },
  });

  if (!job) {
    throw new AppError(StatusCodes.NOT_FOUND, "Job not found or deleted.");
  }

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });
    return {
      isBookmarked: false,
      message: "Job removed from saved bookmarks",
    };
  }

  await prisma.bookmark.create({
    data: {
      userId,
      jobId,
    },
  });

  return {
    isBookmarked: true,
    message: "Job saved successfully",
  };
};

/**
 * Retrieves all saved/bookmarked jobs for the candidate.
 */
const getMyBookmarks = async (
  userId: string,
): Promise<IBookmarkResponse[]> => {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
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
      },
    },
  });

  // Filter out any soft-deleted jobs
  return bookmarks.filter((b) => b.job && !b.job.isDeleted);
};

/**
 * Removes a bookmark.
 */
const removeBookmark = async (
  userId: string,
  jobId: string,
): Promise<{ success: boolean; message: string }> => {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });
  }

  return {
    success: true,
    message: "Job removed from bookmarks",
  };
};

const bookmarkService = {
  toggleBookmark,
  getMyBookmarks,
  removeBookmark,
};

export default bookmarkService;

