import type { IApiResponse } from "../types/auth";
import type { IBookmark } from "../types/bookmark";
import api from "./api";

export const bookmarkService = {
  async toggleBookmark(
    jobId: string,
  ): Promise<{ isBookmarked: boolean; message: string }> {
    const res = await api.post<
      IApiResponse<{ isBookmarked: boolean; message: string }>
    >("/bookmarks/toggle", { jobId });
    return res.data.data;
  },

  async getMyBookmarks(): Promise<IBookmark[]> {
    const res = await api.get<IApiResponse<IBookmark[]>>("/bookmarks");
    return res.data.data || [];
  },

  async removeBookmark(
    jobId: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<
      IApiResponse<{ success: boolean; message: string }>
    >(`/bookmarks/${jobId}`);
    return res.data.data;
  },
};

export default bookmarkService;

