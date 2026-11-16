import type { IJobApplication } from "@/interfaces/application.interface";
import applicationService from "@/services/application.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useApplications(statusFilter?: string) {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await applicationService.getMyApplications({
        status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
      });
      setApplications(data);
    } catch (err: unknown) {
      let msg = "Failed to load applications.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    error,
    refetch: fetchApplications,
    setApplications,
  };
}
