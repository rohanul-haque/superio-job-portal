import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { IBookmark } from "@/types/bookmark";
import { api } from "@/services/api";

export const toggleBookmark = (jobId: string) => {
  return api.post<IApiResponse<{ isBookmarked: boolean; message: string }>>(
    "/bookmarks/toggle",
    { jobId },
  );
};

export const getMyBookmarks = () => {
  return api.get<IApiResponse<IBookmark[]>>("/bookmarks");
};

export const removeBookmark = (jobId: string) => {
  return api.delete<IApiResponse<{ success: boolean; message: string }>>(
    `/bookmarks/${jobId}`,
  );
};
