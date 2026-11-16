import type { ICandidateProfile } from "@/interfaces/candidate.interface";
import type { ICandidateDashboardStats } from "@/responses/candidate.response";
import { getDashboardStats, getProfile } from "@/services/candidate.service";
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
