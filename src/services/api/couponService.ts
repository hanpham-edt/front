import { apiClient } from "./axios-config";
import type {
  Coupon,
  CreateCouponPayload,
  ValidateCouponResponse,
} from "@/types/coupon-types";

export const couponService = {
  async getAll(): Promise<Coupon[]> {
    const { data } = await apiClient.get<Coupon[]>("/coupons/admin");
    return data;
  },

  async getById(id: string): Promise<Coupon> {
    const { data } = await apiClient.get<Coupon>(
      `/coupons/admin/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async create(body: CreateCouponPayload): Promise<Coupon> {
    const { data } = await apiClient.post<Coupon>("/coupons/admin", body);
    return data;
  },

  async update(
    id: string,
    body: Partial<CreateCouponPayload>,
  ): Promise<Coupon> {
    const { data } = await apiClient.patch<Coupon>(
      `/coupons/admin/${encodeURIComponent(id)}`,
      body,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/coupons/admin/${encodeURIComponent(id)}`);
  },

  async validate(code: string, subtotal: number): Promise<ValidateCouponResponse> {
    const { data } = await apiClient.post<ValidateCouponResponse>(
      "/coupons/validate",
      { code, subtotal },
    );
    return data;
  },
};
