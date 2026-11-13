import type { ICategory } from "./category";

export type JobType =
  | "Full-time"
  | "Part-time"
  | "Remote"
  | "Contract"
  | "Internship";

export type ExperienceLevel =
  | "Beginner level"
  | "Intermediate level"
  | "Senior level";

export type HiringStatus = "Ongoing" | "Closed";

export interface IJobCompany {
  id: string;
  name: string;
  email?: string;
  image?: string;
  description?: string;
  website?: string;
  location?: string;
  companySize?: string;
}

export interface IJob {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: ICategory;
  companyId: string;
  company?: IJobCompany;
  location: string;
  level: ExperienceLevel | string;
  salary: number;
  vacancy: number;
  jobType: JobType | string;
  hiringStatus: HiringStatus | string;
  deadline: string;
  visible: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
  _count?: {
    applications: number;
  };
}

export interface IJobFilterParams {
  search?: string;
  keyword?: string;
  category?: string;
  categoryId?: string;
  location?: string;
  level?: string;
  jobType?: string;
  minSalary?: number | string;
  maxSalary?: number | string;
  hiringStatus?: string;
  sortBy?: "newest" | "salary_desc" | "salary_asc" | "deadline";
  page?: number | string;
  limit?: number | string;
}

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

export interface ICreateJobPayload {
  title: string;
  description: string;
  categoryId: string;
  location: string;
  level: ExperienceLevel | string;
  salary: number;
  vacancy?: number;
  jobType: JobType | string;
  hiringStatus?: HiringStatus | string;
  deadline: string;
  visible?: boolean;
}

export interface IUpdateJobPayload {
  title?: string;
  description?: string;
  categoryId?: string;
  location?: string;
  level?: ExperienceLevel | string;
  salary?: number;
  vacancy?: number;
  jobType?: JobType | string;
  hiringStatus?: HiringStatus | string;
  deadline?: string;
  visible?: boolean;
  isDeleted?: boolean;
}


