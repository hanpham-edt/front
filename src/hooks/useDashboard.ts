import { useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "@/types/dashboard-types";
import { DashboardService } from "@/services/api/dashboardService";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DashboardService.getStats();
      setStats(data);
    } catch (err) {
      setError((err as Error).message || "Không tải được thống kê");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return { stats, isLoading, error, refresh: loadStats };
}
