"use client";

import Link from "next/link";
import { ChevronLeft, Loader2, Package } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { usePersistRehydrated } from "@/hooks/usePersistRehydrated";
import { orderService } from "@/services/api/orderService";
import type { OrderResponse, OrderStatusCode } from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";

const PAGE_SIZE = 10;

const STATUS_FILTERS: { value: "" | OrderStatusCode; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default function MyOrdersPage() {
  const router = useRouter();
  const rehydrated = usePersistRehydrated();
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"" | OrderStatusCode>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<{
    data: OrderResponse[];
    total: number;
    page: number;
    limit: number;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getMyOrders({
        page,
        limit: PAGE_SIZE,
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      setPayload(res);
    } catch (e: unknown) {
      let msg = "Không tải được danh sách đơn hàng.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      setError(msg);
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    if (!rehydrated) return;
    if (!isAuthenticated) {
      router.replace(
        `/auth/login?returnUrl=${encodeURIComponent("/account/orders")}`,
      );
      return;
    }
    load();
  }, [rehydrated, isAuthenticated, router, load]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

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

  const totalPages = payload
    ? Math.max(1, Math.ceil(payload.total / PAGE_SIZE))
    : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6 text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Về trang chủ
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-700">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Theo dõi trạng thái đơn hàng và xem chi tiết.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mb-4">
            {error}
          </div>
        ) : null}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          ) : !payload?.data.length ? (
            <div className="text-center py-16 px-4 text-gray-600">
              <p className="mb-4">Bạn chưa có đơn hàng nào.</p>
              <Link
                href="/products"
                className="text-orange-600 font-medium hover:underline"
              >
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-600">
                      <th className="px-4 py-3 font-medium">Mã đơn</th>
                      <th className="px-4 py-3 font-medium hidden sm:table-cell">
                        Ngày đặt
                      </th>
                      <th className="px-4 py-3 font-medium">Trạng thái</th>
                      <th className="px-4 py-3 font-medium text-right">Tổng</th>
                      <th className="px-4 py-3 font-medium text-right w-28">
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payload.data.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-50 hover:bg-orange-50/40"
                      >
                        <td className="px-4 py-3 font-mono text-gray-900">
                          {row.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            {formatOrderStatus(row.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {formatPrice(row.total)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/account/orders/${row.id}`}
                            className="text-orange-600 font-medium hover:underline"
                          >
                            Xem
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 ? (
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                  <p className="text-sm text-gray-600">
                    Trang {payload.page} / {totalPages} ({payload.total} đơn)
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      Trước
                    </button>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
