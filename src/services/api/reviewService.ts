import { apiClient } from "./axios-config";
import type {
  CreateReviewPayload,
  ProductReview,
  ProductReviewSummary,
} from "@/types/review-types";

export const reviewService = {
  async getLatestApproved(limit = 9): Promise<ProductReview[]> {
    const { data } = await apiClient.get<ProductReview[]>("/reviews/latest", {
      params: { limit },
    });
    return data;
  },

  async getByProduct(productId: string): Promise<ProductReviewSummary> {
    const { data } = await apiClient.get<ProductReviewSummary>(
      `/reviews/product/${productId}`,
    );
    return data;
  },

  async create(payload: CreateReviewPayload): Promise<ProductReview> {
    const { data } = await apiClient.post<ProductReview>("/reviews", payload);
    return data;
  },

  async getAllAdmin(approved?: boolean): Promise<ProductReview[]> {
    const { data } = await apiClient.get<ProductReview[]>("/reviews/admin/all", {
      params: approved !== undefined ? { approved } : undefined,
    });
    return data;
  },

  async approve(id: string): Promise<ProductReview> {
    const { data } = await apiClient.patch<ProductReview>(
      `/reviews/admin/${id}/approve`,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/reviews/admin/${id}`);
  },
};
