import { apiClient } from "./axios-config";

export interface SyncCartItemPayload {
  productId: string;
  quantity: number;
  variantId?: string;
}

export const cartService = {
  async syncCart(items: SyncCartItemPayload[]): Promise<void> {
    await apiClient.post("/cart/sync", { items });
  },
};
