import type { SettingsResponse } from "@/types/settings-types";
import { apiClient } from "./axios-config";

const ENDPOINT = "/settings";

export const settingsService = {
  getAll: async (): Promise<SettingsResponse> => {
    const response = await apiClient.get<SettingsResponse>(ENDPOINT);
    return response.data;
  },

  getPublic: async (): Promise<SettingsResponse> => {
    const response = await apiClient.get<SettingsResponse>(
      `${ENDPOINT}/public`,
    );
    return response.data;
  },

  update: async (settings: Record<string, string>): Promise<SettingsResponse> => {
    const response = await apiClient.patch<SettingsResponse>(ENDPOINT, {
      settings,
    });
    return response.data;
  },
};
