"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { orderService } from "@/services/api/orderService";
import type { PaginatedOrdersResponse } from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";

export default function RecentOrders() {
  const [payload, setPayload] = useState<PaginatedOrdersResponse | null>(null);

  const loadOrdersLimit = async () => {
    const data = await orderService.getAllOrders({ limit: 3 });

    setPayload(data);
    return data;
  };

  useEffect(() => {
    void loadOrdersLimit();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const customerHint = (shippingAddress: string) => {
    // shippingAddress lưu dạng nhiều dòng: "Người nhận: ...\nĐiện thoại: ...\nĐịa chỉ: ..."
    const firstLine = (shippingAddress || "").split("\n")[0]?.trim();
    return firstLine || "—";
  };

  return (
    // <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className=" bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Đơn hàng gần đây
          </h3>
          <Link
            href="/admin/orders"
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {(payload?.data ?? []).map((order) => (
          <div key={order.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {customerHint(order.shippingAddress)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(order.total)}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {formatOrderStatus(order.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    // </div>
  );
}
