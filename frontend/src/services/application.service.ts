import {
  applyJob as applyJobApi,
  getMyApplications as getMyApplicationsApi,
  withdrawApplication as withdrawApplicationApi,
} from "@/api/application.api";
import type { IJobApplication } from "@/interfaces/application.interface";

export const applyJob = async (jobId: string): Promise<IJobApplication> => {
  const res = await applyJobApi(jobId);
  return res.data.data;
};

export const getMyApplications = async (params?: {
  status?: string;
}): Promise<IJobApplication[]> => {
  const res = await getMyApplicationsApi(params);
  return res.data.data || [];
};

export const withdrawApplication = async (
  id: string,
): Promise<IJobApplication> => {
  const res = await withdrawApplicationApi(id);
  return res.data.data;
};
