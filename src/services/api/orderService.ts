import { apiClient } from "./axios-config";
import type {
  CreateOrderPayload,
  OrderApiEnvelope,
  OrderResponse,
  PaginatedOrdersResponse,
  PaymentStatusCode,
} from "@/types/order-types";
import type { PaymentMethodCode } from "@/lib/payment-methods";

export interface AdminOrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: PaymentMethodCode;
  paymentStatus?: PaymentStatusCode;
  userId?: string;
}

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

  async getOrderAdmin(id: string): Promise<OrderResponse> {
    const { data } = await apiClient.get<OrderApiEnvelope>(
      `/orders/admin/${id}`,
    );
    return unwrap(data);
  },

  //All order for user
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

  // All orders for admin
  async getAllOrders(
    params?: AdminOrderQueryParams,
  ): Promise<PaginatedOrdersResponse> {
    const { data } = await apiClient.get<PaginatedOrdersResponse>(
      "/orders/admin/all",
      {
        params,
      },
    );
    return data;
  },

  async exportOrdersCsv(params?: AdminOrderQueryParams): Promise<Blob> {
    const { data } = await apiClient.get<Blob>("/orders/admin/export", {
      params,
      responseType: "blob",
    });
    return data;
  },

  async updateOrderAdmin(
    id: string,
    body: { status?: string; trackingNumber?: string; notes?: string },
  ): Promise<OrderResponse> {
    const { data } = await apiClient.patch<OrderApiEnvelope>(
      `/orders/admin/${id}`,
      body,
    );
    return unwrap(data);
  },

  async updatePaymentAdmin(
    id: string,
    body: { status: string },
  ): Promise<OrderResponse> {
    const { data } = await apiClient.patch<OrderApiEnvelope>(
      `/orders/admin/${id}/payment`,
      body,
    );
    return unwrap(data);
  },

  async cancelOrder(id: string): Promise<OrderResponse> {
    const { data } = await apiClient.delete<OrderApiEnvelope>(`/orders/${id}`);
    return unwrap(data);
  },

  async refundOrderAdmin(
    id: string,
    body?: { note?: string },
  ): Promise<OrderResponse> {
    const { data } = await apiClient.post<OrderApiEnvelope>(
      `/orders/admin/${id}/refund`,
      body ?? {},
    );
    return unwrap(data);
  },
};
