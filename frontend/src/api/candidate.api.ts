import type { IApiResponse } from "@/interfaces/api-response.interface";
import type {
  ICandidateProfile,
  IRecommendationsResponseData,
} from "@/interfaces/candidate.interface";
import type { ICandidateDashboardStats } from "@/responses/candidate.response";
import { api } from "@/services/api";

export const getProfile = () => {
  return api.get<IApiResponse<ICandidateProfile>>("/candidate/profile");
};

export const updateProfile = (data: FormData | Record<string, unknown>) => {
  return api.patch<IApiResponse<ICandidateProfile>>("/candidate/profile", data);
};

export const getDashboardStats = () => {
  return api.get<IApiResponse<ICandidateDashboardStats>>("/candidate/dashboard-stats");
};

export const getRecommendations = (refresh = false) => {
  return api.get<IApiResponse<IRecommendationsResponseData>>(
    `/recommendations${refresh ? "?refresh=true" : ""}`,
  );
};

