import type { IApiResponse } from "@/interfaces/api-response.interface";
import type {
  ICreateJobPayload,
  IGenerateJobDescriptionPayload,
  IJob,
  IUpdateJobPayload,
} from "@/interfaces/job.interface";
import type {
  ICandidateMatchingResponseData,
  ICompanyProfile,
  IRecruiterApplicant,
} from "@/interfaces/recruiter.interface";
import type { IRecruiterDashboardStats } from "@/responses/recruiter.response";
import { api } from "@/services/api";

export const getProfile = () => {
  return api.get<IApiResponse<ICompanyProfile>>("/recruiter/profile");
};

export const updateProfile = (data: FormData | Record<string, unknown>) => {
  return api.patch<IApiResponse<ICompanyProfile>>("/recruiter/profile", data);
};

export const getDashboardStats = () => {
  return api.get<IApiResponse<IRecruiterDashboardStats>>(
    "/recruiter/dashboard-stats",
  );
};

export const getApplicants = (params?: { jobId?: string; status?: string }) => {
  return api.get<IApiResponse<IRecruiterApplicant[]>>("/recruiter/applicants", {
    params,
  });
};

export const updateApplicantStatus = (id: string, status: string) => {
  return api.patch<IApiResponse<IRecruiterApplicant>>(
    `/recruiter/applicants/${id}/status`,
    { status },
  );
};

export const getMyJobs = () => {
  return api.get<IApiResponse<IJob[]>>("/jobs/my-jobs");
};

export const createJob = (data: ICreateJobPayload) => {
  return api.post<IApiResponse<IJob>>("/jobs", data);
};

export const updateJob = (id: string, data: IUpdateJobPayload) => {
  return api.patch<IApiResponse<IJob>>(`/jobs/${id}`, data);
};

export const deleteJob = (id: string) => {
  return api.delete<IApiResponse<null>>(`/jobs/${id}`);
};

export const generateJobDescription = (
  payload: IGenerateJobDescriptionPayload,
) => {
  return api.post<IApiResponse<{ description: string }>>(
    "/jobs/generate-description",
    payload,
  );
};

export const getMatchedCandidates = (jobId: string, refresh = false) => {
  return api.get<IApiResponse<ICandidateMatchingResponseData>>(
    `/recruiter/jobs/${jobId}/matched-candidates${refresh ? "?refresh=true" : ""}`,
  );
};
