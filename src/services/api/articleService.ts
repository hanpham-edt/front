import { apiClient } from "./axios-config";
import type {
  Article,
  ArticleListResponse,
  CreateArticle,
} from "@/types/article-types";

export const articleService = {
  async getPublished(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ArticleListResponse> {
    const { data } = await apiClient.get<ArticleListResponse>("/articles", {
      params,
    });
    return data;
  },

  async getBySlug(slug: string): Promise<Article> {
    const { data } = await apiClient.get<Article>(`/articles/slug/${slug}`);
    return data;
  },

  async getAllAdmin(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ArticleListResponse> {
    const { data } = await apiClient.get<ArticleListResponse>(
      "/articles/admin/all",
      { params },
    );
    return data;
  },

  async getByIdAdmin(id: string): Promise<Article> {
    const { data } = await apiClient.get<Article>(`/articles/admin/${id}`);
    return data;
  },

  async create(payload: CreateArticle): Promise<Article> {
    const { data } = await apiClient.post<Article>("/articles/admin", payload);
    return data;
  },

  async update(id: string, payload: Partial<CreateArticle>): Promise<Article> {
    const { data } = await apiClient.patch<Article>(
      `/articles/admin/${id}`,
      payload,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/articles/admin/${id}`);
  },
};
