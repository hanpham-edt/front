"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { orderService } from "@/services/api/orderService";
import type { OrderResponse } from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

interface UserOrderHistoryProps {
  userId: string;
  userEmail: string;
}

export default function UserOrderHistory({
  userId,
  userEmail,
}: UserOrderHistoryProps) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({
        userId,
        limit: 8,
        page: 1,
      });
      setOrders(res.data);
      setTotal(res.total);
    } catch {
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">
          Lịch sử đơn hàng ({total})
        </h4>
        <Link
          href={`/admin/orders?userId=${encodeURIComponent(userId)}`}
          className="text-sm text-orange-600 hover:text-orange-800"
        >
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500">
          {userEmail} chưa có đơn hàng nào.
        </p>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm"
            >
              <div>
                <span className="font-mono font-medium text-gray-900">
                  {order.orderNumber}
                </span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="text-gray-600">
                  {formatOrderStatus(order.status)}
                </span>
                <p className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right shrink-0 pl-2">
                <p className="font-medium text-orange-600">
                  {formatPrice(order.total)}
                </p>
                <Link
                  href={`/admin/orders/${order.id}/edit`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Chi tiết
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
