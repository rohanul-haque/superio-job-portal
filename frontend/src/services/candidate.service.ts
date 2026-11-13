import type { IApiResponse } from "../types/auth";
import type {
  ICandidateDashboardStats,
  ICandidateProfile,
} from "../types/candidate";
import api from "./api";

export const candidateService = {
  async getProfile(): Promise<ICandidateProfile> {
    const res = await api.get<IApiResponse<ICandidateProfile>>("/candidate/profile");
    return res.data.data;
  },

  async updateProfile(
    data: FormData | Record<string, unknown>,
  ): Promise<ICandidateProfile> {
    const res = await api.patch<IApiResponse<ICandidateProfile>>(
      "/candidate/profile",
      data,
    );
    return res.data.data;
  },

  async getDashboardStats(): Promise<ICandidateDashboardStats> {
    const res = await api.get<IApiResponse<ICandidateDashboardStats>>(
      "/candidate/dashboard-stats",
    );
    return res.data.data;
  },
};

export default candidateService;

