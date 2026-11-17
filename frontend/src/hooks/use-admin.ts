import { queryKeys } from "@/lib/query-keys";
import { getDashboardStats } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export default function useAdminDashboard() {
  const query = useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: getDashboardStats,
  });

  return {
    data: query.data || null,
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
