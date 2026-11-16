import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { IBookmark } from "@/types/bookmark";
import api from "@/services/api";

export const bookmarkApi = {
  toggleBookmark(jobId: string) {
    return api.post<IApiResponse<{ isBookmarked: boolean; message: string }>>(
      "/bookmarks/toggle",
      { jobId },
    );
  },

  getMyBookmarks() {
    return api.get<IApiResponse<IBookmark[]>>("/bookmarks");
  },

  removeBookmark(jobId: string) {
    return api.delete<IApiResponse<{ success: boolean; message: string }>>(
      `/bookmarks/${jobId}`,
    );
  },
};

export default bookmarkApi;
