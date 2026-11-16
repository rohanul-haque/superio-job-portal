import { bookmarkApi } from "@/api/bookmark.api";
import type { IBookmark } from "@/types/bookmark";

export const bookmarkService = {
  async toggleBookmark(
    jobId: string,
  ): Promise<{ isBookmarked: boolean; message: string }> {
    const res = await bookmarkApi.toggleBookmark(jobId);
    return res.data.data;
  },

  async getMyBookmarks(): Promise<IBookmark[]> {
    const res = await bookmarkApi.getMyBookmarks();
    return res.data.data || [];
  },

  async removeBookmark(
    jobId: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await bookmarkApi.removeBookmark(jobId);
    return res.data.data;
  },
};

export default bookmarkService;
