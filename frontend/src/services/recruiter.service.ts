import {
  createJob as createJobApi,
  deleteJob as deleteJobApi,
  generateJobDescription as generateJobDescriptionApi,
  getApplicants as getApplicantsApi,
  getDashboardStats as getDashboardStatsApi,
  getMatchedCandidates as getMatchedCandidatesApi,
  getMyJobs as getMyJobsApi,
  getProfile as getProfileApi,
  updateApplicantStatus as updateApplicantStatusApi,
  updateJob as updateJobApi,
  updateProfile as updateProfileApi,
} from "@/api/recruiter.api";
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

export const getProfile = async (): Promise<ICompanyProfile> => {
  const res = await getProfileApi();
  return res.data.data;
};

export const updateProfile = async (
  data: FormData | Record<string, unknown>,
): Promise<ICompanyProfile> => {
  const res = await updateProfileApi(data);
  return res.data.data;
};

export const getDashboardStats =
  async (): Promise<IRecruiterDashboardStats> => {
    const res = await getDashboardStatsApi();
    return res.data.data;
  };

export const getApplicants = async (params?: {
  jobId?: string;
  status?: string;
}): Promise<IRecruiterApplicant[]> => {
  const res = await getApplicantsApi(params);
  return res.data.data || [];
};

export const updateApplicantStatus = async (
  id: string,
  status: string,
): Promise<IRecruiterApplicant> => {
  const res = await updateApplicantStatusApi(id, status);
  return res.data.data;
};

export const getMyJobs = async (): Promise<IJob[]> => {
  const res = await getMyJobsApi();
  return res.data.data || [];
};

export const createJob = async (data: ICreateJobPayload): Promise<IJob> => {
  const res = await createJobApi(data);
  return res.data.data;
};

export const updateJob = async (
  id: string,
  data: IUpdateJobPayload,
): Promise<IJob> => {
  const res = await updateJobApi(id, data);
  return res.data.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await deleteJobApi(id);
};

export const generateJobDescription = async (
  payload: IGenerateJobDescriptionPayload,
): Promise<string> => {
  const res = await generateJobDescriptionApi(payload);
  return res.data.data?.description || "";
};

export const getMatchedCandidates = async (
  jobId: string,
  refresh = false,
): Promise<ICandidateMatchingResponseData> => {
  const res = await getMatchedCandidatesApi(jobId, refresh);
  return res.data.data;
};
