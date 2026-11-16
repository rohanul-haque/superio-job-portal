import type { IJob } from "@/interfaces/job.interface";
import type { ICompanyProfile, IRecruiterApplicant } from "@/interfaces/recruiter.interface";
import type { IRecruiterDashboardStats } from "@/responses/recruiter.response";
import recruiterService from "@/services/recruiter.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useRecruiterDashboard() {
  const [statsData, setStatsData] = useState<IRecruiterDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await recruiterService.getDashboardStats();
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
      const data = await recruiterService.getMyJobs();
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
      const data = await recruiterService.getApplicants({ jobId });
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
      const data = await recruiterService.getProfile();
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
