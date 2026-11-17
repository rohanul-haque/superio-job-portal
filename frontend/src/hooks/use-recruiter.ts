import type { IJob } from "@/interfaces/job.interface";
import type {
  ICandidateMatchingResponseData,
  ICompanyProfile,
  IRecruiterApplicant,
} from "@/interfaces/recruiter.interface";
import type { IRecruiterDashboardStats } from "@/responses/recruiter.response";
import {
  getApplicants,
  getDashboardStats,
  getMatchedCandidates,
  getMyJobs,
  getProfile,
} from "@/services/recruiter.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";

export function useRecruiterDashboard() {
  const [statsData, setStatsData] = useState<IRecruiterDashboardStats | null>(null);
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

export function useRecruiterJobs() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (err: unknown) {
      let msg = "Failed to load posted jobs.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    isLoading,
    error,
    refetch: fetchJobs,
  };
}

export function useRecruiterApplicants(jobId?: string) {
  const [applicants, setApplicants] = useState<IRecruiterApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getApplicants({ jobId });
      setApplicants(data);
    } catch (err: unknown) {
      let msg = "Failed to load applicants.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  return {
    applicants,
    isLoading,
    error,
    refetch: fetchApplicants,
  };
}

export function useCompanyProfile() {
  const [profile, setProfile] = useState<ICompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err: unknown) {
      let msg = "Failed to load company profile.";
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

export function useCandidateMatching() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [matchingData, setMatchingData] =
    useState<ICandidateMatchingResponseData | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Recruiter's Jobs
  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const data = await getMyJobs();
      const activeJobs = data.filter((j) => !j.isDeleted);
      setJobs(activeJobs);
      if (activeJobs.length > 0 && !selectedJobId) {
        setSelectedJobId(activeJobs[0].id);
      }
    } catch (err: unknown) {
      let msg = "Failed to load jobs for candidate matching.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoadingJobs(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // 2. Fetch Matched Candidates for selected job
  const fetchMatches = useCallback(
    async (jobId: string, refresh = false) => {
      if (!jobId) {
        setMatchingData(null);
        return;
      }
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoadingMatches(true);
      }
      setError(null);
      try {
        const data = await getMatchedCandidates(jobId, refresh);
        setMatchingData(data);
        if (refresh) {
          toast.success("Matches Refreshed", {
            description: "Evaluated latest candidate profiles against this role.",
          });
        }
      } catch (err: unknown) {
        let msg = "Failed to evaluate candidate matches.";
        if (err instanceof Error) msg = err.message;
        setError(msg);
        toast.error("Matching Error", { description: msg });
      } finally {
        setIsLoadingMatches(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedJobId) {
      fetchMatches(selectedJobId, false);
    }
  }, [selectedJobId, fetchMatches]);

  return {
    jobs,
    selectedJobId,
    setSelectedJobId,
    matchingData,
    matches: matchingData?.matches || [],
    job: matchingData?.job,
    meta: matchingData?.meta,
    isLoadingJobs,
    isLoadingMatches,
    isRefreshing,
    error,
    refetch: (refresh = true) => {
      if (selectedJobId) fetchMatches(selectedJobId, refresh);
    },
    refetchJobs: fetchJobs,
  };
}
