export interface IBookmarkResponse {
  id: string;
  userId: string;
  jobId: string;
  createdAt: Date;
  job?: {
    id: string;
    title: string;
    location: string;
    salary: number;
    jobType: string;
    level: string;
    hiringStatus: string;
    deadline: Date;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    company?: {
      id: string;
      name: string;
      image: string;
      location: string;
    };
  };
}

