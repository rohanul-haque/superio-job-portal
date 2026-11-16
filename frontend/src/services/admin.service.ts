import { adminApi } from "@/api/admin.api";
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
import type { IAdminDashboardStats } from "@/responses/admin.response";

export const adminService = {
  async getDashboardStats(): Promise<IAdminDashboardStats> {
    const res = await adminApi.getDashboardStats();
    return res.data.data;
  },

  async getCandidates(params?: {
    search?: string;
    status?: string;
    page?: number | string;
    limit?: number | string;
  }): Promise<{ candidates: IAdminCandidate[]; meta: { total: number; totalPages: number } }> {
    const res = await adminApi.getCandidates(params);
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
    const res = await adminApi.moderateCandidate(id, payload);
    return res.data.data;
  },

  async getRecruiters(params?: {
    search?: string;
    status?: string;
    page?: number | string;
    limit?: number | string;
  }): Promise<{ recruiters: IAdminRecruiter[]; meta: { total: number; totalPages: number } }> {
    const res = await adminApi.getRecruiters(params);
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
    const res = await adminApi.moderateRecruiter(id, payload);
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
    const res = await adminApi.getAllJobs(params);
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
    const res = await adminApi.moderateJob(id, payload);
    return res.data.data;
  },

  async getTrashItems(params?: { type?: string }): Promise<ITrashItem[]> {
    const res = await adminApi.getTrashItems(params);
    return res.data.data || [];
  },

  async restoreTrashItem(payload: IRestoreTrashPayload): Promise<{ message?: string }> {
    const res = await adminApi.restoreTrashItem(payload);
    return { message: res.data.message };
  },

  async permanentlyDeleteTrashItem(
    type: string,
    id: string,
  ): Promise<{ message?: string }> {
    const res = await adminApi.permanentlyDeleteTrashItem(type, id);
    return { message: res.data.message };
  },

  async getProfile(): Promise<IAdminProfile> {
    const res = await adminApi.getProfile();
    return res.data.data;
  },

  async updateProfile(
    payload: IUpdateAdminProfilePayload,
  ): Promise<IAdminProfile> {
    const res = await adminApi.updateProfile(payload);
    return res.data.data;
  },

  async uploadProfileImage(file: File): Promise<IAdminProfile> {
    const res = await adminApi.uploadProfileImage(file);
    return res.data.data;
  },

  async removeProfileImage(): Promise<IAdminProfile> {
    const res = await adminApi.removeProfileImage();
    return res.data.data;
  },

  async changePassword(
    payload: IChangeAdminPasswordPayload,
  ): Promise<{ message?: string }> {
    const res = await adminApi.changePassword(payload);
    return { message: res.data.message };
  },
};

export default adminService;
