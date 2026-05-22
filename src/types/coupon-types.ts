export type CouponType = "PERCENT" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
}

export interface ValidateCouponResponse {
  valid: boolean;
  message: string;
  discount?: number;
  code?: string;
}
