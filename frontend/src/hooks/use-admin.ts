import type { IAdminDashboardStats } from "@/responses/admin.response";
import { getDashboardStats } from "@/services/admin.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function useAdminDashboard() {
  const [data, setData] = useState<IAdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await getDashboardStats();
      setData(stats);
    } catch (err: unknown) {
      let msg = "Failed to load admin telemetry.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
      toast.error("Dashboard Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
