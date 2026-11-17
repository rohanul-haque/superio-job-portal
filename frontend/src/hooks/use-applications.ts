import { queryKeys } from "@/lib/query-keys";
import { getMyApplications } from "@/services/application.service";
import { useQuery } from "@tanstack/react-query";

export default function useApplications(statusFilter?: string) {
  const query = useQuery({
    queryKey: queryKeys.candidate.applications(statusFilter),
    queryFn: () =>
      getMyApplications({
        status:
          statusFilter && statusFilter !== "all" ? statusFilter : undefined,
      }),
  });

  return {
    applications: query.data || [],
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
