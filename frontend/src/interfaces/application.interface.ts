import type { ApplicationStatus } from "@/types/application.type";

export interface IJobApplication {
  id: string;
  userId: string;
  jobId: string;
  companyId: string;
  status: ApplicationStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  job: {
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
  company: {
    id: string;
    name: string;
    image: string;
    location: string;
  };
}

export interface IApplyJobPayload {
  jobId: string;
  coverLetter?: string;
  notes?: string;
}
