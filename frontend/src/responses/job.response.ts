import type { IJob } from "@/interfaces/job.interface";

export interface IJobsResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IJobsResponseData {
  jobs: IJob[];
  meta: IJobsResponseMeta;
}

export interface ISingleJobDetail {
  job: IJob;
  similarJobs: IJob[];
}
