export interface IApplyJobPayload {
  jobId: string;
}

export interface IMyApplicationsQuery {
  status?: string;
  page?: string;
  limit?: string;
}

export interface IApplicationResponse {
  id: string;
  userId: string;
  jobId: string;
  companyId: string;
  status: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  job?: {
    id: string;
    title: string;
    location: string;
    salary: number;
    jobType: string;
    hiringStatus: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  company?: {
    id: string;
    name: string;
    image: string;
    location: string;
  };
}

