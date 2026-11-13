import type { ICategoryIcon } from "../category/category.interface";

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
  deadline: string | Date;
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
  deadline?: string | Date;
  visible?: boolean;
  isDeleted?: boolean;
}

export interface IJobFilterQuery {
  search?: string;
  keyword?: string;
  categoryId?: string;
  category?: string;
  categorySlug?: string;
  location?: string;
  level?: string;
  jobType?: string;
  minSalary?: string | number;
  maxSalary?: string | number;
  hiringStatus?: string;
  visible?: string;
  companyId?: string;
  sortBy?: "newest" | "salary_desc" | "salary_asc" | "deadline";
  page?: string | number;
  limit?: string | number;
}

export interface IJobCompanySummary {
  id: string;
  name: string;
  email: string;
  image: string;
  description: string;
  website: string;
  location: string;
  companySize: string;
}

export interface IJobCategorySummary {
  id: string;
  name: string;
  slug: string;
  icon: ICategoryIcon;
}

export interface IJobResponse {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: IJobCategorySummary;
  companyId: string;
  company?: IJobCompanySummary;
  location: string;
  level: string;
  salary: number;
  vacancy: number;
  jobType: string;
  hiringStatus: string;
  deadline: Date;
  visible: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  applicationCount?: number;
  _count?: {
    applications: number;
  };
}

export interface ISingleJobDetailResponse {
  job: IJobResponse;
  similarJobs: IJobResponse[];
}

