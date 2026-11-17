export type MatchLevel =
  | "Excellent Match"
  | "Strong Match"
  | "Good Match"
  | "Moderate Match"
  | "Weak Match"
  | "Low Match";

export interface IAIRecommendationRaw {
  jobId: string;
  matchScore: number;
  matchLevel: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  matchedTechnicalSkills?: string[];
  missingRequiredSkills?: string[];
  matchedProfessionalSkills?: string[];
  matchedPreferredSkills?: string[];
  titleCompatibility?: number;
  bioCompatibility?: number;
  experienceCompatibility?: number;
  qualificationCompatibility?: number;
  responsibilityCompatibility?: number;
  mandatoryRequirementsPassed?: boolean;
  explanation?: string;
  rejectionReasons?: string[];
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
  matchedTechnicalSkills?: string[];
  missingRequiredSkills?: string[];
  matchedProfessionalSkills?: string[];
  matchedPreferredSkills?: string[];
  titleCompatibility?: number;
  bioCompatibility?: number;
  experienceCompatibility?: number;
  qualificationCompatibility?: number;
  responsibilityCompatibility?: number;
  mandatoryRequirementsPassed?: boolean;
  explanation?: string;
  rejectionReasons?: string[];
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

export interface IAICandidateMatchRaw {
  candidateId: string;
  matchScore: number;
  matchLevel: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  matchedTechnicalSkills?: string[];
  missingRequiredSkills?: string[];
  matchedProfessionalSkills?: string[];
  matchedPreferredSkills?: string[];
  titleCompatibility?: number;
  bioCompatibility?: number;
  experienceCompatibility?: number;
  qualificationCompatibility?: number;
  responsibilityCompatibility?: number;
  mandatoryRequirementsPassed?: boolean;
  explanation?: string;
  rejectionReasons?: string[];
}

export interface IMatchedCandidateItem {
  id: string;
  name: string;
  email: string;
  profilePicture?: {
    url: string;
    publicId: string;
  } | null;
  title: string;
  bio: string;
  skills: string[];
  socialLinks?: Record<string, string> | null;
  resume?: string;
  createdAt: Date;
}

export interface ICandidateMatchResponse {
  candidateId: string;
  matchScore: number;
  matchLevel: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  candidate: IMatchedCandidateItem;
  matchedTechnicalSkills?: string[];
  missingRequiredSkills?: string[];
  matchedProfessionalSkills?: string[];
  matchedPreferredSkills?: string[];
  titleCompatibility?: number;
  bioCompatibility?: number;
  experienceCompatibility?: number;
  qualificationCompatibility?: number;
  responsibilityCompatibility?: number;
  mandatoryRequirementsPassed?: boolean;
  explanation?: string;
  rejectionReasons?: string[];
}

export interface ICandidateMatchingResult {
  jobId: string;
  job: {
    id: string;
    title: string;
    location: string;
    level: string;
    jobType: string;
    hiringStatus: string;
    category?: string;
  };
  matches: ICandidateMatchResponse[];
  meta: {
    total: number;
    cached: boolean;
    evaluatedCount: number;
    timestamp: string;
    message?: string;
  };
}
