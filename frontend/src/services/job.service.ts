import { jobApi } from "@/api/job.api";
import type { IJobFilterParams } from "@/interfaces/job.interface";
import type {
  IJobsResponseData,
  ISingleJobDetail,
} from "@/responses/job.response";

export const jobService = {
  async getAllJobs(params?: IJobFilterParams): Promise<IJobsResponseData> {
    const res = await jobApi.getAllJobs(params);
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
    const res = await jobApi.getJobById(id);
    return res.data.data;
  },
};

export default jobService;
