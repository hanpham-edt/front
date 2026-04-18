"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { usePersistRehydrated } from "@/hooks/usePersistRehydrated";
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
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const rehydrated = usePersistRehydrated();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (e: unknown) {
      let msg = "Không tải được đơn hàng.";
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        msg = "Không tìm thấy đơn hàng.";
      } else if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      setError(msg);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!rehydrated) return;
    if (!isAuthenticated) {
      router.replace(
        `/auth/login?returnUrl=${encodeURIComponent(`/account/orders/${id}`)}`,
      );
      return;
    }
    if (id) load();
  }, [rehydrated, isAuthenticated, router, id, load]);

  const handleCancel = async () => {
    if (!order || order.status !== "PENDING") return;
    if (
      !window.confirm(
        "Bạn có chắc muốn hủy đơn hàng này? Hàng sẽ được hoàn lại kho.",
      )
    ) {
      return;
    }
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order.id);
      setOrder(updated);
    } catch (e: unknown) {
      let msg = "Không hủy được đơn hàng.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      alert(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (!rehydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-600">
        Đang chuyển đến trang đăng nhập…
      </div>
    );
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Đơn hàng không hợp lệ.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6 text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Danh sách đơn hàng
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn</p>
                  <p className="text-xl font-mono font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Đặt lúc {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <span className="inline-flex rounded-full bg-orange-50 text-orange-800 px-3 py-1 text-sm font-medium mt-1">
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ giao hàng
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {order.shippingAddress || "—"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="px-6 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100 bg-gray-50">
                Sản phẩm
              </h2>
              <ul className="divide-y divide-gray-50">
                {order.items.map((line) => (
                  <li
                    key={line.id}
                    className="px-6 py-4 flex justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {line.productName}
                      </p>
                      <p className="text-gray-500">
                        {line.quantity} × {formatPrice(line.price)}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900 shrink-0">
                      {formatPrice(line.subtotal)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between text-base font-bold">
                <span>Tổng cộng</span>
                <span className="text-orange-600">{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.status === "PENDING" ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancel}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelling ? "Đang hủy…" : "Hủy đơn hàng"}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
