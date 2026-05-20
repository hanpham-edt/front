import type { DashboardStats } from "@/types/dashboard-types";
import { apiClient } from "./axios-config";

export class DashboardService {
  private static readonly ENDPOINT = "/admin/dashboard";

  static async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<DashboardStats>(
      `${this.ENDPOINT}/stats`,
    );
    return data;
  }
}
