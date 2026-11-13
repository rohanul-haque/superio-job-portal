import type { IApiResponse } from "../types/auth";
import type { ICreateJobPayload, IJob, IUpdateJobPayload } from "../types/job";
import type {
  ICompanyProfile,
  IRecruiterApplicant,
  IRecruiterDashboardStats,
} from "../types/recruiter";
import api from "./api";

export const recruiterService = {
  async getProfile(): Promise<ICompanyProfile> {
    const res =
      await api.get<IApiResponse<ICompanyProfile>>("/recruiter/profile");
    return res.data.data;
  },

  async updateProfile(
    data: FormData | Record<string, unknown>,
  ): Promise<ICompanyProfile> {
    const res = await api.patch<IApiResponse<ICompanyProfile>>(
      "/recruiter/profile",
      data,
    );
    return res.data.data;
  },

  async getDashboardStats(): Promise<IRecruiterDashboardStats> {
    const res = await api.get<IApiResponse<IRecruiterDashboardStats>>(
      "/recruiter/dashboard-stats",
    );
    return res.data.data;
  },

  async getApplicants(params?: {
    jobId?: string;
    status?: string;
  }): Promise<IRecruiterApplicant[]> {
    const res = await api.get<IApiResponse<IRecruiterApplicant[]>>(
      "/recruiter/applicants",
      { params },
    );
    return res.data.data || [];
  },

  async updateApplicantStatus(
    id: string,
    status: string,
  ): Promise<IRecruiterApplicant> {
    const res = await api.patch<IApiResponse<IRecruiterApplicant>>(
      `/recruiter/applicants/${id}/status`,
      { status },
    );
    return res.data.data;
  },

  async getMyJobs(): Promise<IJob[]> {
    const res = await api.get<IApiResponse<IJob[]>>("/jobs/my-jobs");
    return res.data.data || [];
  },

  async createJob(payload: ICreateJobPayload): Promise<IJob> {
    const res = await api.post<IApiResponse<IJob>>("/jobs", payload);
    return res.data.data;
  },

  async updateJob(id: string, payload: IUpdateJobPayload): Promise<IJob> {
    const res = await api.patch<IApiResponse<IJob>>(`/jobs/${id}`, payload);
    return res.data.data;
  },

  async deleteJob(id: string): Promise<IJob> {
    const res = await api.delete<IApiResponse<IJob>>(`/jobs/${id}`);
    return res.data.data;
  },
};

export default recruiterService;
