export type MatchLevel =
  | "Excellent Match"
  | "Good Match"
  | "Moderate Match"
  | "Low Match";

export interface IAIRecommendationRaw {
  jobId: string;
  matchScore: number;
  matchLevel: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
}

export interface IRecommendedJobItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  companyId: string;
  company?: {
    id: string;
    name: string;
    image?: string;
    location?: string;
    website?: string;
    companySize?: string;
  } | null;
  location: string;
  level: string;
  salary: number;
  vacancy: number;
  jobType: string;
  hiringStatus: string;
  deadline: Date;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecommendedJobResponse {
  jobId: string;
  matchScore: number;
  matchLevel: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  job: IRecommendedJobItem;
}

export interface IRecommendationsResult {
  recommendations: IRecommendedJobResponse[];
  meta: {
    total: number;
    profileCompleted: boolean;
    cached: boolean;
    evaluatedCount: number;
    timestamp: string;
    message?: string;
  };
}
