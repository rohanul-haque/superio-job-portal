import type { IJob, IJobFilterParams } from "@/interfaces/job.interface";
import type { IJobsResponseMeta } from "@/responses/job.response";
import { getAllJobs } from "@/services/job.service";
import { useCallback, useEffect, useState } from "react";

export function useJobs(initialParams?: IJobFilterParams) {
  const [params, setParams] = useState<IJobFilterParams>(initialParams || {});
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [meta, setMeta] = useState<IJobsResponseMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllJobs(params);
      setJobs(data.jobs);
      setMeta(data.meta);
    } catch (err: unknown) {
      let msg = "Failed to load jobs.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    meta,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchJobs,
  };
}

export default useJobs;
