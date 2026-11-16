import { recruiterApi } from "@/api/recruiter.api";
import type { ICreateJobPayload, IJob, IUpdateJobPayload } from "@/interfaces/job.interface";
import type {
  ICompanyProfile,
  IRecruiterApplicant,
} from "@/interfaces/recruiter.interface";
import type { IRecruiterDashboardStats } from "@/responses/recruiter.response";

export const recruiterService = {
  async getProfile(): Promise<ICompanyProfile> {
    const res = await recruiterApi.getProfile();
    return res.data.data;
  },

  async updateProfile(
    data: FormData | Record<string, unknown>,
  ): Promise<ICompanyProfile> {
    const res = await recruiterApi.updateProfile(data);
    return res.data.data;
  },

  async getDashboardStats(): Promise<IRecruiterDashboardStats> {
    const res = await recruiterApi.getDashboardStats();
    return res.data.data;
  },

  async getApplicants(params?: {
    jobId?: string;
    status?: string;
  }): Promise<IRecruiterApplicant[]> {
    const res = await recruiterApi.getApplicants(params);
    return res.data.data || [];
  },

  async updateApplicantStatus(
    id: string,
    status: string,
  ): Promise<IRecruiterApplicant> {
    const res = await recruiterApi.updateApplicantStatus(id, status);
    return res.data.data;
  },

  async getMyJobs(): Promise<IJob[]> {
    const res = await recruiterApi.getMyJobs();
    return res.data.data || [];
  },

  async createJob(data: ICreateJobPayload): Promise<IJob> {
    const res = await recruiterApi.createJob(data);
    return res.data.data;
  },

  async updateJob(id: string, data: IUpdateJobPayload): Promise<IJob> {
    const res = await recruiterApi.updateJob(id, data);
    return res.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    await recruiterApi.deleteJob(id);
  },
};

export default recruiterService;
