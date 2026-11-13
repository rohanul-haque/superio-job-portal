export interface IBookmark {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    salary: number;
    jobType: string;
    level: string;
    hiringStatus: string;
    deadline: string;
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

