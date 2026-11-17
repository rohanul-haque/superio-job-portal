import { queryKeys } from "@/lib/query-keys";
import {
  getDashboardStats,
  getProfile,
  getRecommendations,
} from "@/services/candidate.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";

export function useCandidateDashboard() {
  const query = useQuery({
    queryKey: queryKeys.candidate.dashboard(),
    queryFn: getDashboardStats,
  });

  return {
    statsData: query.data || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error
      ? query.error.message
      : query.error
        ? String(query.error)
        : null,
    refetch: query.refetch,
  };
}

export function useCandidateProfile() {
  const query = useQuery({
    queryKey: queryKeys.candidate.profile(),
    queryFn: getProfile,
  });

  return {
    profile: query.data || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error
      ? query.error.message
      : query.error
        ? String(query.error)
        : null,
    refetch: query.refetch,
  };
}

export function useCandidateRecommendations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.candidate.recommendations(false),
    queryFn: () => getRecommendations(false),
  });

  const refreshMutation = useMutation({
    mutationFn: () => getRecommendations(true),
    onSuccess: (newData) => {
      queryClient.setQueryData(
        queryKeys.candidate.recommendations(false),
        newData
      );
      toast.success("Recommendations Refreshed", {
        description: "Fetched latest job matches based on your profile.",
      });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to refresh recommendations.";
      toast.error("Recommendations Error", { description: msg });
    },
  });

  const isRefreshing = refreshMutation.isPending;

  return {
    data: query.data || null,
    recommendations: query.data?.recommendations || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isRefreshing,
    error: query.error instanceof Error
      ? query.error.message
      : query.error
        ? String(query.error)
        : null,
    refetch: async (refresh = false) => {
      if (refresh) {
        return refreshMutation.mutateAsync();
      }
      return query.refetch();
    },
  };
}
