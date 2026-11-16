import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { IJob, IJobFilterParams } from "@/interfaces/job.interface";
import type { ISingleJobDetail } from "@/responses/job.response";
import api from "@/services/api";

export const jobApi = {
  getAllJobs(params?: IJobFilterParams) {
    return api.get<IApiResponse<IJob[]>>("/jobs", { params });
  },

  getJobById(id: string) {
    return api.get<IApiResponse<ISingleJobDetail>>(`/jobs/${id}`);
  },
};

export default jobApi;
