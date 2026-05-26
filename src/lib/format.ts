import type { Locale } from "@/i18n/routing";

function intlLocale(locale?: Locale): string {
  return locale === "en" ? "en-US" : "vi-VN";
}

export function formatCurrency(amount: number, locale?: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number, locale?: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(value);
}

/** Chuỗi chỉ còn chữ số → số nguyên VND (dùng cho ô nhập giá). */
export function parseVndInput(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

/** Hiển thị trong ô nhập: 1.500.000 (không kèm đơn vị). */
export function formatVndInput(value: number): string {
  if (!value || value <= 0) return "";
  return formatNumber(value);
}

export function formatGrowthPercent(value: number | null): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}
