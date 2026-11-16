import type {
  ICandidateProfile,
  IRecommendationsResponseData,
} from "@/interfaces/candidate.interface";
import type { ICandidateDashboardStats } from "@/responses/candidate.response";
import {
  getDashboardStats,
  getProfile,
  getRecommendations,
} from "@/services/candidate.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useCandidateDashboard() {
  const [statsData, setStatsData] = useState<ICandidateDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStatsData(data);
    } catch (err: unknown) {
      let msg = "Failed to load dashboard metrics.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
      toast.error("Dashboard error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    statsData,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

export function useCandidateProfile() {
  const [profile, setProfile] = useState<ICandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err: unknown) {
      let msg = "Failed to load candidate profile.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}

export function useCandidateRecommendations() {
  const [data, setData] = useState<IRecommendationsResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const res = await getRecommendations(refresh);
      setData(res);
      if (refresh) {
        toast.success("Recommendations Refreshed", {
          description: "Fetched latest job matches based on your profile.",
        });
      }
    } catch (err: unknown) {
      let msg = "Failed to load job recommendations.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
      toast.error("Recommendations Error", { description: msg });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations(false);
  }, [fetchRecommendations]);

  return {
    data,
    recommendations: data?.recommendations || [],
    meta: data?.meta,
    isLoading,
    isRefreshing,
    error,
    refetch: (refresh = false) => fetchRecommendations(refresh),
  };
}
