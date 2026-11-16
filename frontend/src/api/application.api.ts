import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { IJobApplication } from "@/interfaces/application.interface";
import api from "@/services/api";

export const applicationApi = {
  applyJob(jobId: string) {
    return api.post<IApiResponse<IJobApplication>>("/applications/apply", { jobId });
  },

  getMyApplications(params?: { status?: string }) {
    return api.get<IApiResponse<IJobApplication[]>>("/applications/my-applications", { params });
  },

  withdrawApplication(id: string) {
    return api.patch<IApiResponse<IJobApplication>>(`/applications/${id}/withdraw`);
  },
};

export default applicationApi;
