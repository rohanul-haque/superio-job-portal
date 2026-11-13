import type { IApiResponse } from "../types/auth";
import type {
  IJob,
  IJobFilterParams,
  IJobsResponseData,
  ISingleJobDetail,
} from "../types/job";
import api from "./api";

export const jobService = {
  async getAllJobs(params?: IJobFilterParams): Promise<IJobsResponseData> {
    const res = await api.get<IApiResponse<IJob[]>>("/jobs", {
      params,
    });
    return {
      jobs: res.data.data || [],
      meta: {
        page: res.data.meta?.page || 1,
        limit: res.data.meta?.limit || 10,
        total: res.data.meta?.total ?? (res.data.data || []).length,
        totalPage: res.data.meta?.totalPage || 1,
      },
    };
  },

  async getJobById(id: string): Promise<ISingleJobDetail> {
    const res = await api.get<IApiResponse<ISingleJobDetail>>(`/jobs/${id}`);
    return res.data.data;
  },
};

export default jobService;
