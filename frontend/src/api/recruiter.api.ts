import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { ICreateJobPayload, IJob, IUpdateJobPayload } from "@/interfaces/job.interface";
import type { ICompanyProfile, IRecruiterApplicant } from "@/interfaces/recruiter.interface";
import type { IRecruiterDashboardStats } from "@/responses/recruiter.response";
import api from "@/services/api";

export const recruiterApi = {
  getProfile() {
    return api.get<IApiResponse<ICompanyProfile>>("/recruiter/profile");
  },

  updateProfile(data: FormData | Record<string, unknown>) {
    return api.patch<IApiResponse<ICompanyProfile>>("/recruiter/profile", data);
  },

  getDashboardStats() {
    return api.get<IApiResponse<IRecruiterDashboardStats>>("/recruiter/dashboard-stats");
  },

  getApplicants(params?: { jobId?: string; status?: string }) {
    return api.get<IApiResponse<IRecruiterApplicant[]>>("/recruiter/applicants", { params });
  },

  updateApplicantStatus(id: string, status: string) {
    return api.patch<IApiResponse<IRecruiterApplicant>>(
      `/recruiter/applicants/${id}/status`,
      { status },
    );
  },

  getMyJobs() {
    return api.get<IApiResponse<IJob[]>>("/jobs/my-jobs");
  },

  createJob(data: ICreateJobPayload) {
    return api.post<IApiResponse<IJob>>("/jobs", data);
  },

  updateJob(id: string, data: IUpdateJobPayload) {
    return api.patch<IApiResponse<IJob>>(`/jobs/${id}`, data);
  },

  deleteJob(id: string) {
    return api.delete<IApiResponse<null>>(`/jobs/${id}`);
  },
};

export default recruiterApi;
