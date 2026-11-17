import type { IJobFilterParams } from "@/interfaces/job.interface";
import { queryKeys } from "@/lib/query-keys";
import { getAllJobs } from "@/services/job.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useJobs(initialParams?: IJobFilterParams) {
  const [params, setParams] = useState<IJobFilterParams>(initialParams || {});

  const jobsQuery = useQuery({
    queryKey: queryKeys.jobs.list(params as Record<string, unknown>),
    queryFn: () => getAllJobs(params),
  });

  return {
    jobs: jobsQuery.data?.jobs || [],
    meta: jobsQuery.data?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPage: 1,
    },
    isLoading: jobsQuery.isLoading,
    isFetching: jobsQuery.isFetching,
    error: jobsQuery.error instanceof Error
      ? jobsQuery.error.message
      : jobsQuery.error
        ? String(jobsQuery.error)
        : null,
    params,
    setParams,
    refetch: jobsQuery.refetch,
  };
}
