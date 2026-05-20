"use client";

import Link from "next/link";
import type { OrderStatusCount } from "@/types/dashboard-types";
import { formatOrderStatus, getOrderStatusClass } from "@/lib/order-status-style";

const STATUS_ORDER = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

interface OrderStatusOverviewProps {
  ordersByStatus: OrderStatusCount[];
  isLoading?: boolean;
}

export default function OrderStatusOverview({
  ordersByStatus,
  isLoading,
}: OrderStatusOverviewProps) {
  const sorted = [...ordersByStatus].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
  );
  const total = sorted.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="h-full rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-orange-600 hover:text-orange-500"
        >
          Chi tiết
        </Link>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : total === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">Chưa có đơn hàng</p>
        ) : (
          <ul className="space-y-4">
            {sorted.map((row) => {
              const percent = total > 0 ? Math.round((row.count / total) * 100) : 0;
              return (
                <li key={row.status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusClass(row.status)}`}
                    >
                      {formatOrderStatus(row.status)}
                    </span>
                    <span className="font-medium text-gray-900">
                      {row.count}{" "}
                      <span className="font-normal text-gray-500">({percent}%)</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
