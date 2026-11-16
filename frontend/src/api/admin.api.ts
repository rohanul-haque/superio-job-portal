import type {
  IAdminCandidate,
  IAdminJob,
  IAdminProfile,
  IAdminRecruiter,
  IChangeAdminPasswordPayload,
  IModerateJobPayload,
  IModerateUserPayload,
  IRestoreTrashPayload,
  ITrashItem,
  IUpdateAdminProfilePayload,
} from "@/interfaces/admin.interface";
import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { IAdminDashboardStats } from "@/responses/admin.response";
import api from "@/services/api";

export const adminApi = {
  getDashboardStats() {
    return api.get<IApiResponse<IAdminDashboardStats>>("/admin/dashboard-stats");
  },

  getCandidates(params?: {
    search?: string;
    status?: string;
    page?: number | string;
    limit?: number | string;
  }) {
    return api.get<IApiResponse<IAdminCandidate[]>>("/admin/candidates", { params });
  },

  moderateCandidate(id: string, payload: IModerateUserPayload) {
    return api.patch<IApiResponse<IAdminCandidate>>(
      `/admin/candidates/${id}/moderate`,
      payload,
    );
  },

  getRecruiters(params?: {
    search?: string;
    status?: string;
    page?: number | string;
    limit?: number | string;
  }) {
    return api.get<IApiResponse<IAdminRecruiter[]>>("/admin/recruiters", { params });
  },

  moderateRecruiter(id: string, payload: IModerateUserPayload) {
    return api.patch<IApiResponse<IAdminRecruiter>>(
      `/admin/recruiters/${id}/moderate`,
      payload,
    );
  },

  getAllJobs(params?: {
    search?: string;
    categoryId?: string;
    hiringStatus?: string;
    visible?: string;
    page?: number | string;
    limit?: number | string;
  }) {
    return api.get<IApiResponse<IAdminJob[]>>("/admin/jobs", { params });
  },

  moderateJob(id: string, payload: IModerateJobPayload) {
    return api.patch<IApiResponse<IAdminJob>>(`/admin/jobs/${id}/moderate`, payload);
  },

  getTrashItems(params?: { type?: string }) {
    return api.get<IApiResponse<ITrashItem[]>>("/admin/trash", { params });
  },

  restoreTrashItem(payload: IRestoreTrashPayload) {
    return api.post<IApiResponse<null>>("/admin/trash/restore", payload);
  },

  permanentlyDeleteTrashItem(type: string, id: string) {
    return api.delete<IApiResponse<null>>(`/admin/trash/${type}/${id}`);
  },

  getProfile() {
    return api.get<IApiResponse<IAdminProfile>>("/admin/profile");
  },

  updateProfile(payload: IUpdateAdminProfilePayload) {
    return api.patch<IApiResponse<IAdminProfile>>("/admin/profile", payload);
  },

  uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return api.post<IApiResponse<IAdminProfile>>("/admin/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  removeProfileImage() {
    return api.delete<IApiResponse<IAdminProfile>>("/admin/profile/image");
  },

  changePassword(payload: IChangeAdminPasswordPayload) {
    return api.patch<IApiResponse<null>>("/admin/change-password", payload);
  },
};

export default adminApi;
