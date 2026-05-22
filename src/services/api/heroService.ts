import {
  CreateHero,
  Hero,
  HeroListResponse,
  UpdateHero,
} from "@/types/hero-types";
import { apiClient } from "./axios-config";

const ENDPOINT = "/heros";

export const heroService = {
  getAll: async (): Promise<Hero[]> => {
    const response = await apiClient.get<Hero[]>(ENDPOINT);
    return response.data;
  },

  getAllAdmin: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<HeroListResponse> => {
    const response = await apiClient.get<HeroListResponse>(
      `${ENDPOINT}/admin/all`,
      { params },
    );
    return response.data;
  },

  getById: async (id: number): Promise<Hero> => {
    const response = await apiClient.get<Hero>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (data: CreateHero): Promise<Hero> => {
    const response = await apiClient.post<Hero>(ENDPOINT, data);
    return response.data;
  },

  update: async (id: number, data: UpdateHero): Promise<Hero> => {
    const response = await apiClient.patch<Hero>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
