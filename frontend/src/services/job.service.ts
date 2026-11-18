import {
  generateJobDescription as generateJobDescriptionApi,
  getAllJobs as getAllJobsApi,
  getJobById as getJobByIdApi,
} from "@/api/job.api";
import type {
  IGenerateJobDescriptionPayload,
  IJobFilterParams,
} from "@/interfaces/job.interface";
import type {
  IJobsResponseData,
  ISingleJobDetail,
} from "@/responses/job.response";

export const getAllJobs = async (
  params?: IJobFilterParams,
): Promise<IJobsResponseData> => {
  const res = await getAllJobsApi(params);
  return {
    jobs: res.data.data || [],
    meta: {
      page: res.data.meta?.page || 1,
      limit: res.data.meta?.limit || 10,
      total: res.data.meta?.total ?? (res.data.data || []).length,
      totalPage: res.data.meta?.totalPage || 1,
    },
  };
};

export const getJobById = async (id: string): Promise<ISingleJobDetail> => {
  const res = await getJobByIdApi(id);
  return res.data.data;
};

export const generateJobDescription = async (
  payload: IGenerateJobDescriptionPayload,
): Promise<string> => {
  const res = await generateJobDescriptionApi(payload);
  return res.data.data?.description || "";
};
