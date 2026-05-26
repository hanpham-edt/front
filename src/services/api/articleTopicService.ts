import { apiClient } from "./axios-config";
import type {
  ArticleTopic,
  CreateArticleTopic,
} from "@/types/article-types";

export const articleTopicService = {
  async getPublished(): Promise<ArticleTopic[]> {
    const { data } = await apiClient.get<ArticleTopic[]>("/article-topics");
    return data;
  },

  async getAllAdmin(): Promise<ArticleTopic[]> {
    const { data } = await apiClient.get<ArticleTopic[]>(
      "/article-topics/admin/all",
    );
    return data;
  },

  async create(payload: CreateArticleTopic): Promise<ArticleTopic> {
    const { data } = await apiClient.post<ArticleTopic>(
      "/article-topics/admin",
      payload,
    );
    return data;
  },

  async update(
    id: string,
    payload: Partial<CreateArticleTopic>,
  ): Promise<ArticleTopic> {
    const { data } = await apiClient.patch<ArticleTopic>(
      `/article-topics/admin/${id}`,
      payload,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/article-topics/admin/${id}`);
  },
};
