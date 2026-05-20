import { formatOrderStatus } from "@/lib/order-status";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function getOrderStatusClass(status: string): string {
  return STATUS_STYLES[status] ?? "bg-gray-100 text-gray-800";
}

export { formatOrderStatus };
