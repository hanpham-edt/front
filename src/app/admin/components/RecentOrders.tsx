"use client";

import Link from "next/link";
import type { DashboardRecentOrder } from "@/types/dashboard-types";
import { formatCurrency } from "@/lib/format";
import {
  formatOrderStatus,
  getOrderStatusClass,
} from "@/lib/order-status-style";

interface RecentOrdersProps {
  orders: DashboardRecentOrder[];
  isLoading?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  return (
    <div className="h-full rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-orange-600 hover:text-orange-500"
        >
          Xem tất cả
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4 px-6 py-4">
              <div className="h-10 flex-1 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-gray-500">
          Chưa có đơn hàng nào
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders`}
              className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-orange-50/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {order.orderNumber}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {order.customerName}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(order.total)}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusClass(order.status)}`}
                >
                  {formatOrderStatus(order.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
