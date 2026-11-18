import { queryKeys } from "@/lib/query-keys";
import {
  getApplicants,
  getDashboardStats,
  getMatchedCandidates,
  getMyJobs,
  getProfile,
} from "@/services/recruiter.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";

export function useRecruiterDashboard() {
  const query = useQuery({
    queryKey: queryKeys.recruiter.dashboard(),
    queryFn: getDashboardStats,
  });

  return {
    statsData: query.data || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? String(query.error)
          : null,
    refetch: query.refetch,
  };
}

export function useRecruiterJobs() {
  const query = useQuery({
    queryKey: queryKeys.recruiter.jobs(),
    queryFn: getMyJobs,
  });

  return {
    jobs: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? String(query.error)
          : null,
    refetch: query.refetch,
  };
}

export function useRecruiterApplicants(jobId?: string) {
  const query = useQuery({
    queryKey: queryKeys.recruiter.applicants({ jobId }),
    queryFn: () => getApplicants({ jobId }),
  });

  return {
    applicants: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? String(query.error)
          : null,
    refetch: query.refetch,
  };
}

export function useCompanyProfile() {
  const query = useQuery({
    queryKey: queryKeys.recruiter.profile(),
    queryFn: getProfile,
  });

  return {
    profile: query.data || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? String(query.error)
          : null,
    refetch: query.refetch,
  };
}

export function useCandidateMatching() {
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // 1. Fetch Recruiter's Jobs
  const jobsQuery = useQuery({
    queryKey: queryKeys.recruiter.jobs(),
    queryFn: getMyJobs,
  });

  const jobs = useMemo(() => {
    return (jobsQuery.data || []).filter((j) => !j.isDeleted);
  }, [jobsQuery.data]);

  // Automatically select first active job when available
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  // 2. Fetch Matched Candidates for selected job
  const matchesQuery = useQuery({
    queryKey: queryKeys.recruiter.matches(selectedJobId, false),
    queryFn: () => getMatchedCandidates(selectedJobId, false),
    enabled: Boolean(selectedJobId),
  });

  // Refresh Mutation for AI matching
  const refreshMutation = useMutation({
    mutationFn: (jobId: string) => getMatchedCandidates(jobId, true),
    onSuccess: (data, jobId) => {
      queryClient.setQueryData(queryKeys.recruiter.matches(jobId, false), data);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to evaluate candidate matches.";
      toast.error("Matching Error", { description: msg });
    },
  });

  return {
    jobs,
    selectedJobId,
    setSelectedJobId,
    matchingData: matchesQuery.data || null,
    matches: matchesQuery.data?.matches || [],
    job: matchesQuery.data?.job,
    meta: matchesQuery.data?.meta,
    isLoadingJobs: jobsQuery.isLoading,
    isLoadingMatches: matchesQuery.isLoading,
    isRefreshing: refreshMutation.isPending,
    error:
      matchesQuery.error instanceof Error
        ? matchesQuery.error.message
        : matchesQuery.error
          ? String(matchesQuery.error)
          : null,
    refetch: (refresh = true) => {
      if (!selectedJobId) return;
      if (refresh) {
        refreshMutation.mutate(selectedJobId);
      } else {
        matchesQuery.refetch();
      }
    },
    refetchJobs: jobsQuery.refetch,
  };
}
