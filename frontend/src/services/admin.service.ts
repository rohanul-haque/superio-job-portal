import {
  changePassword as changePasswordApi,
  getCandidates as getCandidatesApi,
  getDashboardStats as getDashboardStatsApi,
  getAllJobs as getAllJobsApi,
  getProfile as getProfileApi,
  getRecruiters as getRecruitersApi,
  getTrashItems as getTrashItemsApi,
  moderateCandidate as moderateCandidateApi,
  moderateJob as moderateJobApi,
  moderateRecruiter as moderateRecruiterApi,
  permanentlyDeleteTrashItem as permanentlyDeleteTrashItemApi,
  removeProfileImage as removeProfileImageApi,
  restoreTrashItem as restoreTrashItemApi,
  updateProfile as updateProfileApi,
  uploadProfileImage as uploadProfileImageApi,
} from "@/api/admin.api";
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

export const getDashboardStats = async (): Promise<IAdminDashboardStats> => {
  const res = await getDashboardStatsApi();
  return res.data.data;
};

export const getCandidates = async (params?: {
  search?: string;
  status?: string;
  page?: number | string;
  limit?: number | string;
}): Promise<{
  candidates: IAdminCandidate[];
  meta: { total: number; totalPages: number };
}> => {
  const res = await getCandidatesApi(params);
  return {
    candidates: res.data.data || [],
    meta: {
      total: res.data.meta?.total || 0,
      totalPages: res.data.meta?.totalPage || 1,
    },
  };
};

export const moderateCandidate = async (
  id: string,
  payload: IModerateUserPayload,
): Promise<IAdminCandidate> => {
  const res = await moderateCandidateApi(id, payload);
  return res.data.data;
};

export const getRecruiters = async (params?: {
  search?: string;
  status?: string;
  page?: number | string;
  limit?: number | string;
}): Promise<{
  recruiters: IAdminRecruiter[];
  meta: { total: number; totalPages: number };
}> => {
  const res = await getRecruitersApi(params);
  return {
    recruiters: res.data.data || [],
    meta: {
      total: res.data.meta?.total || 0,
      totalPages: res.data.meta?.totalPage || 1,
    },
  };
};

export const moderateRecruiter = async (
  id: string,
  payload: IModerateUserPayload,
): Promise<IAdminRecruiter> => {
  const res = await moderateRecruiterApi(id, payload);
  return res.data.data;
};

export const getAllJobs = async (params?: {
  search?: string;
  categoryId?: string;
  hiringStatus?: string;
  visible?: string;
  page?: number | string;
  limit?: number | string;
}): Promise<{
  jobs: IAdminJob[];
  meta: { total: number; totalPages: number };
}> => {
  const res = await getAllJobsApi(params);
  return {
    jobs: res.data.data || [],
    meta: {
      total: res.data.meta?.total || 0,
      totalPages: res.data.meta?.totalPage || 1,
    },
  };
};

export const moderateJob = async (
  id: string,
  payload: IModerateJobPayload,
): Promise<IAdminJob> => {
  const res = await moderateJobApi(id, payload);
  return res.data.data;
};

export const getTrashItems = async (params?: {
  type?: string;
}): Promise<ITrashItem[]> => {
  const res = await getTrashItemsApi(params);
  return res.data.data || [];
};

export const restoreTrashItem = async (
  payload: IRestoreTrashPayload,
): Promise<{ message?: string }> => {
  const res = await restoreTrashItemApi(payload);
  return { message: res.data.message };
};

export const permanentlyDeleteTrashItem = async (
  type: string,
  id: string,
): Promise<{ message?: string }> => {
  const res = await permanentlyDeleteTrashItemApi(type, id);
  return { message: res.data.message };
};

export const getProfile = async (): Promise<IAdminProfile> => {
  const res = await getProfileApi();
  return res.data.data;
};

export const updateProfile = async (
  payload: IUpdateAdminProfilePayload,
): Promise<IAdminProfile> => {
  const res = await updateProfileApi(payload);
  return res.data.data;
};

export const uploadProfileImage = async (
  file: File,
): Promise<IAdminProfile> => {
  const res = await uploadProfileImageApi(file);
  return res.data.data;
};

export const removeProfileImage = async (): Promise<IAdminProfile> => {
  const res = await removeProfileImageApi();
  return res.data.data;
};

export const changePassword = async (
  payload: IChangeAdminPasswordPayload,
): Promise<{ message?: string }> => {
  const res = await changePasswordApi(payload);
  return { message: res.data.message };
};
