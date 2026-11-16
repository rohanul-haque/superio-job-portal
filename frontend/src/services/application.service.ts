import { applicationApi } from "@/api/application.api";
import type { IJobApplication } from "@/interfaces/application.interface";

export const applicationService = {
  async applyJob(jobId: string): Promise<IJobApplication> {
    const res = await applicationApi.applyJob(jobId);
    return res.data.data;
  },

  async getMyApplications(params?: {
    status?: string;
  }): Promise<IJobApplication[]> {
    const res = await applicationApi.getMyApplications(params);
    return res.data.data || [];
  },

  async withdrawApplication(id: string): Promise<IJobApplication> {
    const res = await applicationApi.withdrawApplication(id);
    return res.data.data;
  },
};

export default applicationService;
