export interface IJobApplication {
  id: string;
  userId: string;
  jobId: string;
  companyId: string;
  status: "Pending" | "Shortlisted" | "Accepted" | "Rejected" | "Withdrawn";
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

