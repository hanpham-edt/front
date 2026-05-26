import type { PublicPaymentOptions } from "@/types/settings-types";
import {
  Banknote,
  Building2,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PaymentMethodCode =
  | "cod"
  | "bank_transfer"
  | "credit_card"
  | "paypal"
  | "atm_card"
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
    label: "Thẻ Visa / Mastercard",
    description:
      "Thanh toán trực tuyến qua Stripe — thẻ tín dụng hoặc ghi nợ quốc tế.",
    icon: CreditCard,
  },
  {
    code: "paypal",
    label: "PayPal",
    description:
      "Thanh toán bằng tài khoản PayPal hoặc thẻ liên kết PayPal.",
    icon: Wallet,
  },
  {
    code: "atm_card",
    label: "Thẻ ATM nội địa",
    description:
      "Thanh toán qua VNPay — thẻ ATM các ngân hàng Việt Nam (Napas).",
    icon: Landmark,
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
  paypal: "paypalEnabled",
  atm_card: "atmCardEnabled",
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
      return "Visa/MC";
    case "paypal":
      return "PayPal";
    case "atm_card":
      return "ATM nội địa";
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
  return method === "bank_transfer";
}

/** Phương thức chuyển hướng sang cổng thanh toán sau khi đặt hàng */
export function isOnlineGatewayRedirect(
  method: string | null | undefined,
): boolean {
  return (
    method === "momo" ||
    method === "paypal" ||
    method === "credit_card" ||
    method === "atm_card"
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
      return "Thanh toán thẻ quốc tế đã được ghi nhận hoặc đang xử lý. Đơn sẽ được xác nhận tự động.";
    case "paypal":
      return "Thanh toán PayPal đã được ghi nhận hoặc đang xử lý. Đơn sẽ được xác nhận tự động.";
    case "atm_card":
      return "Thanh toán thẻ ATM nội địa đã được ghi nhận hoặc đang xử lý qua VNPay.";
    case "momo":
      return "Thanh toán MoMo đã được ghi nhận hoặc đang xử lý. Đơn sẽ được xác nhận tự động.";
    case "cod":
    default:
      return "Shipper sẽ giao hàng và bạn thanh toán bằng tiền mặt khi nhận (COD).";
  }
}
