import {
  getMyBookmarks as getMyBookmarksApi,
  removeBookmark as removeBookmarkApi,
  toggleBookmark as toggleBookmarkApi,
} from "@/api/bookmark.api";
import type { IBookmark } from "@/types/bookmark";

export const toggleBookmark = async (
  jobId: string,
): Promise<{ isBookmarked: boolean; message: string }> => {
  const res = await toggleBookmarkApi(jobId);
  return res.data.data;
};

export const getMyBookmarks = async (): Promise<IBookmark[]> => {
  const res = await getMyBookmarksApi();
  return res.data.data || [];
};

export const removeBookmark = async (
  jobId: string,
): Promise<{ success: boolean; message: string }> => {
  const res = await removeBookmarkApi(jobId);
  return res.data.data;
};
