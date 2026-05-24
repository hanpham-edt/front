export interface CreateOrderItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export type PaymentMethodCode =
  | "cod"
  | "bank_transfer"
  | "credit_card"
  | "momo";

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  shippingAddress?: string;
  paymentMethod: PaymentMethodCode;
  couponCode?: string;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  variantId?: string | null;
  variantName?: string | null;
  productName: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  subtotal?: number;
  discount?: number;
  couponCode?: string | null;
  shipping?: number;
  tax?: number;
  total: number;
  shippingAddress: string;
  trackingNumber?: string | null;
  notes?: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderApiEnvelope {
  success: boolean;
  message?: string;
  data: OrderResponse;
  /** Có khi thanh toán MoMo — chuyển hướng khách tới URL này */
  momoPayUrl?: string;
}

/** GET /orders — không bọc { success, data } */
export interface PaginatedOrdersResponse {
  data: OrderResponse[];
  total: number;
  page: number;
  limit: number;
}

export type OrderStatusCode =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatusCode =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";
