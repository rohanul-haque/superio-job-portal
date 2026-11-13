import type { IApiResponse } from "../types/auth";
import type {
  IAdminCandidate,
  IAdminDashboardStats,
  IAdminJob,
  IAdminProfile,
  IAdminRecruiter,
  IChangeAdminPasswordPayload,
  IModerateJobPayload,
  IModerateUserPayload,
  IRestoreTrashPayload,
  ITrashItem,
  IUpdateAdminProfilePayload,
} from "../types/admin";
import api from "./api";

export const adminService = {
  async getDashboardStats(): Promise<IAdminDashboardStats> {
    const res = await api.get<IApiResponse<IAdminDashboardStats>>(
      "/admin/dashboard-stats",
    );
    return res.data.data;
  },

  async getCandidates(params?: {
    search?: string;
    status?: string;
    page?: number | string;
    limit?: number | string;
  }): Promise<{ candidates: IAdminCandidate[]; meta: { total: number; totalPages: number } }> {
    const res = await api.get<IApiResponse<IAdminCandidate[]>>(
      "/admin/candidates",
      { params },
    );
    return {
      candidates: res.data.data || [],
      meta: {
        total: res.data.meta?.total || 0,
        totalPages: res.data.meta?.totalPage || 1,
      },
    };
  },

  async moderateCandidate(
    id: string,
    payload: IModerateUserPayload,
  ): Promise<IAdminCandidate> {
    const res = await api.patch<IApiResponse<IAdminCandidate>>(
      `/admin/candidates/${id}/moderate`,
      payload,
    );
    return res.data.data;
  },

  async getRecruiters(params?: {
    search?: string;
    status?: string;
    page?: number | string;
    limit?: number | string;
  }): Promise<{ recruiters: IAdminRecruiter[]; meta: { total: number; totalPages: number } }> {
    const res = await api.get<IApiResponse<IAdminRecruiter[]>>(
      "/admin/recruiters",
      { params },
    );
    return {
      recruiters: res.data.data || [],
      meta: {
        total: res.data.meta?.total || 0,
        totalPages: res.data.meta?.totalPage || 1,
      },
    };
  },

  async moderateRecruiter(
    id: string,
    payload: IModerateUserPayload,
  ): Promise<IAdminRecruiter> {
    const res = await api.patch<IApiResponse<IAdminRecruiter>>(
      `/admin/recruiters/${id}/moderate`,
      payload,
    );
    return res.data.data;
  },

  async getAllJobs(params?: {
    search?: string;
    categoryId?: string;
    hiringStatus?: string;
    visible?: string;
    page?: number | string;
    limit?: number | string;
  }): Promise<{ jobs: IAdminJob[]; meta: { total: number; totalPages: number } }> {
    const res = await api.get<IApiResponse<IAdminJob[]>>("/admin/jobs", {
      params,
    });
    return {
      jobs: res.data.data || [],
      meta: {
        total: res.data.meta?.total || 0,
        totalPages: res.data.meta?.totalPage || 1,
      },
    };
  },

  async moderateJob(
    id: string,
    payload: IModerateJobPayload,
  ): Promise<IAdminJob> {
    const res = await api.patch<IApiResponse<IAdminJob>>(
      `/admin/jobs/${id}/moderate`,
      payload,
    );
    return res.data.data;
  },

  async getTrashItems(params?: { type?: string }): Promise<ITrashItem[]> {
    const res = await api.get<IApiResponse<ITrashItem[]>>("/admin/trash", {
      params,
    });
    return res.data.data || [];
  },

  async restoreTrashItem(
    payload: IRestoreTrashPayload,
  ): Promise<{ success: boolean; message: string }> {
    const res = await api.patch<IApiResponse<{ success: boolean; message: string }>>(
      "/admin/trash/restore",
      payload,
    );
    return res.data.data;
  },

  async permanentlyDeleteTrashItem(
    type: string,
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<IApiResponse<{ success: boolean; message: string }>>(
      `/admin/trash/${type}/${id}`,
    );
    return res.data.data;
  },

  async getProfile(): Promise<IAdminProfile> {
    const res = await api.get<IApiResponse<IAdminProfile>>("/admin/profile");
    return res.data.data;
  },

  async updateProfile(
    payload: FormData | IUpdateAdminProfilePayload,
  ): Promise<IAdminProfile> {
    const isFormData =
      typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await api.patch<IApiResponse<IAdminProfile>>(
      "/admin/profile",
      payload,
      isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    );
    return res.data.data;
  },

  async uploadProfileImage(file: File): Promise<IAdminProfile> {
    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("profileImage", file);
    formData.append("image", file);
    const res = await api.post<IApiResponse<IAdminProfile>>(
      "/admin/profile/avatar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data.data;
  },

  async removeProfileImage(): Promise<IAdminProfile> {
    const res = await api.delete<IApiResponse<IAdminProfile>>(
      "/admin/profile/avatar",
    );
    return res.data.data;
  },

  async changePassword(
    payload: IChangeAdminPasswordPayload,
  ): Promise<{ message: string }> {
    const res = await api.patch<IApiResponse<null>>(
      "/admin/change-password",
      payload,
    );
    return { message: res.data.message || "Password changed successfully" };
  },
};

export default adminService;

