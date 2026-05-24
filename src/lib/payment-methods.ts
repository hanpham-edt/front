import type { PublicPaymentOptions } from "@/types/settings-types";
import { Banknote, Building2, CreditCard, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PaymentMethodCode =
  | "cod"
  | "bank_transfer"
  | "credit_card"
  | "momo";

export interface PaymentMethodOption {
  code: PaymentMethodCode;
  label: string;
  description: string;
  icon: LucideIcon;
}

const ALL_METHODS: PaymentMethodOption[] = [
  {
    code: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng.",
    icon: Banknote,
  },
  {
    code: "bank_transfer",
    label: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản theo thông tin bên dưới, ghi rõ mã đơn hàng.",
    icon: Building2,
  },
  {
    code: "credit_card",
    label: "Thẻ tín dụng / Ghi nợ",
    description:
      "Nhân viên sẽ liên hệ hướng dẫn thanh toán qua cổng thẻ (đang triển khai).",
    icon: CreditCard,
  },
  {
    code: "momo",
    label: "Ví MoMo",
    description:
      "Thanh toán trực tuyến qua cổng MoMo (quét QR / ví MoMo). Đơn được xác nhận tự động.",
    icon: Smartphone,
  },
];

const SETTING_KEY_BY_CODE: Record<
  PaymentMethodCode,
  keyof PublicPaymentOptions
> = {
  cod: "codEnabled",
  bank_transfer: "bankTransferEnabled",
  credit_card: "creditCardEnabled",
  momo: "momoEnabled",
};

export function getEnabledPaymentMethods(
  options: PublicPaymentOptions,
): PaymentMethodOption[] {
  return ALL_METHODS.filter((m) => options[SETTING_KEY_BY_CODE[m.code]]);
}

export function getPaymentMethodLabel(code: string | null | undefined): string {
  const found = ALL_METHODS.find((m) => m.code === code);
  return found?.label ?? code ?? "—";
}

export function getPaymentMethodShortLabel(
  code: string | null | undefined,
): string {
  switch (code) {
    case "cod":
      return "COD";
    case "bank_transfer":
      return "Chuyển khoản";
    case "credit_card":
      return "Thẻ tín dụng";
    case "momo":
      return "MoMo";
    default:
      return "—";
  }
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  COMPLETED: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  REFUNDED: "Đã hoàn tiền",
};

export function getPaymentStatusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  return PAYMENT_STATUS_LABELS[status] ?? status;
}

export function getPaymentStatusClass(status: string | null | undefined): string {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    case "REFUNDED":
      return "bg-gray-100 text-gray-800";
    case "PENDING":
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export function getPaymentMethodIcon(code: string | null | undefined) {
  const found = ALL_METHODS.find((m) => m.code === code);
  return found?.icon ?? Banknote;
}

export type PaymentStatusCode =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export const PAYMENT_STATUS_OPTIONS: {
  value: PaymentStatusCode;
  label: string;
}[] = [
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "COMPLETED", label: "Đã thanh toán" },
  { value: "FAILED", label: "Thanh toán thất bại" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

/** Cần admin xác nhận thủ công khi khách đã chuyển tiền */
export function needsPaymentConfirmation(
  method: string | null | undefined,
): boolean {
  return (
    method === "bank_transfer" ||
    method === "momo" ||
    method === "credit_card"
  );
}

export function getPaymentSuccessMessage(
  code: string | null | undefined,
  orderNumber: string,
  bankAccount?: string,
  bankName?: string,
): string {
  switch (code) {
    case "bank_transfer":
      return `Vui lòng chuyển khoản đến ${bankName ?? "ngân hàng"} — STK ${bankAccount ?? "—"}, nội dung: ${orderNumber}. Đơn sẽ được xử lý sau khi chúng tôi xác nhận thanh toán.`;
    case "credit_card":
      return "Chúng tôi sẽ liên hệ để hướng dẫn thanh toán thẻ. Đơn đang chờ xác nhận.";
    case "momo":
      return "Bạn sẽ được chuyển sang MoMo để thanh toán. Sau khi thanh toán thành công, đơn sẽ được xử lý tự động.";
    case "cod":
    default:
      return "Shipper sẽ giao hàng và bạn thanh toán bằng tiền mặt khi nhận (COD).";
  }
}
