import { apiClient } from "./axios-config";
import type {
  CreateOrderPayload,
  OrderApiEnvelope,
  OrderResponse,
  PaginatedOrdersResponse,
} from "@/types/order-types";

function unwrap(res: OrderApiEnvelope): OrderResponse {
  if (!res.success || !res.data) {
    throw new Error(res.message || "Không xử lý được yêu cầu đơn hàng");
  }
  return res.data;
}

export const orderService = {
  async createOrder(body: CreateOrderPayload): Promise<OrderResponse> {
    const { data } = await apiClient.post<OrderApiEnvelope>("/orders", body);
    return unwrap(data);
  },

  async getOrder(id: string): Promise<OrderResponse> {
    const { data } = await apiClient.get<OrderApiEnvelope>(`/orders/${id}`);
    return unwrap(data);
  },

  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedOrdersResponse> {
    const { data } = await apiClient.get<PaginatedOrdersResponse>("/orders", {
      params,
    });
    return data;
  },

  async cancelOrder(id: string): Promise<OrderResponse> {
    const { data } = await apiClient.delete<OrderApiEnvelope>(`/orders/${id}`);
    return unwrap(data);
  },
};
