import { apiClient } from "./axios-config";

export interface AbandonedCartItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface AbandonedCart {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string | null;
  totalItems: number;
  totalPrice: number;
  itemLines: number;
  updatedAt: string;
  createdAt: string;
  reminderSentAt: string | null;
  items: AbandonedCartItem[];
}

export interface AbandonedCartListResponse {
  data: AbandonedCart[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    inactiveHours: number;
  };
}

export const abandonedCartService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    inactiveHours?: number;
  }): Promise<AbandonedCartListResponse> {
    const { data } = await apiClient.get<AbandonedCartListResponse>(
      "/abandoned-carts",
      { params },
    );
    return data;
  },

  async getById(id: string): Promise<AbandonedCart> {
    const { data } = await apiClient.get<AbandonedCart>(
      `/abandoned-carts/${id}`,
    );
    return data;
  },

  async sendReminder(id: string): Promise<{ sent: boolean; message: string }> {
    const { data } = await apiClient.post<{ sent: boolean; message: string }>(
      `/abandoned-carts/${id}/remind`,
    );
    return data;
  },
};
