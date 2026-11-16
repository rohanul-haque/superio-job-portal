import {
  getDashboardStats as getDashboardStatsApi,
  getProfile as getProfileApi,
  getRecommendations as getRecommendationsApi,
  updateProfile as updateProfileApi,
} from "@/api/candidate.api";
import type {
  ICandidateProfile,
  IRecommendationsResponseData,
} from "@/interfaces/candidate.interface";
import type { ICandidateDashboardStats } from "@/responses/candidate.response";

export const getProfile = async (): Promise<ICandidateProfile> => {
  const res = await getProfileApi();
  return res.data.data;
};

export const updateProfile = async (
  data: FormData | Record<string, unknown>,
): Promise<ICandidateProfile> => {
  const res = await updateProfileApi(data);
  return res.data.data;
};

export const getDashboardStats =
  async (): Promise<ICandidateDashboardStats> => {
    const res = await getDashboardStatsApi();
    return res.data.data;
  };

export const getRecommendations = async (
  refresh = false,
): Promise<IRecommendationsResponseData> => {
  const res = await getRecommendationsApi(refresh);
  return res.data.data;
};

