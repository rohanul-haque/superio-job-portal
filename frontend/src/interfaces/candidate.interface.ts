export interface ICloudinaryFile {
  url: string;
  publicId: string;
}

export interface ICandidateProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: ICloudinaryFile | null;
  title: string;
  bio: string;
  skills: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    facebook?: string;
    twitter?: string;
  } | null;
  resume?: ICloudinaryFile | string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IApplicationActivityItem {
  date: string;
  applications: number;
}

export interface IUpdateCandidateProfilePayload {
  name?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    facebook?: string;
    twitter?: string;
  } | null;
}
