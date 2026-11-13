import type { IApiResponse } from "../types/auth";
import type { IJobApplication } from "../types/application";
import api from "./api";

export const applicationService = {
  async applyJob(jobId: string): Promise<IJobApplication> {
    const res = await api.post<IApiResponse<IJobApplication>>(
      "/applications/apply",
      { jobId },
    );
    return res.data.data;
  },

  async getMyApplications(params?: {
    status?: string;
  }): Promise<IJobApplication[]> {
    const res = await api.get<IApiResponse<IJobApplication[]>>(
      "/applications/my-applications",
      { params },
    );
    return res.data.data || [];
  },

  async withdrawApplication(id: string): Promise<IJobApplication> {
    const res = await api.patch<IApiResponse<IJobApplication>>(
      `/applications/${id}/withdraw`,
    );
    return res.data.data;
  },
};

export default applicationService;
