import { candidateApi } from "@/api/candidate.api";
import type { ICandidateProfile } from "@/interfaces/candidate.interface";
import type { ICandidateDashboardStats } from "@/responses/candidate.response";

export const candidateService = {
  async getProfile(): Promise<ICandidateProfile> {
    const res = await candidateApi.getProfile();
    return res.data.data;
  },

  async updateProfile(
    data: FormData | Record<string, unknown>,
  ): Promise<ICandidateProfile> {
    const res = await candidateApi.updateProfile(data);
    return res.data.data;
  },

  async getDashboardStats(): Promise<ICandidateDashboardStats> {
    const res = await candidateApi.getDashboardStats();
    return res.data.data;
  },
};

export default candidateService;
