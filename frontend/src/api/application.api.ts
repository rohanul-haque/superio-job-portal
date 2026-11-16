import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { IJobApplication } from "@/interfaces/application.interface";
import api from "@/services/api";

export const applyJob = (jobId: string) => {
  return api.post<IApiResponse<IJobApplication>>("/applications/apply", {
    jobId,
  });
};

export const getMyApplications = (params?: { status?: string }) => {
  return api.get<IApiResponse<IJobApplication[]>>(
    "/applications/my-applications",
    { params },
  );
};

export const withdrawApplication = (id: string) => {
  return api.patch<IApiResponse<IJobApplication>>(
    `/applications/${id}/withdraw`,
  );
};
