"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  MapPin,
  Package,
  Calendar,
  Hash,
  AlertCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { usePersistRehydrated } from "@/hooks/usePersistRehydrated";
import { orderService } from "@/services/api/orderService";
import type { OrderResponse } from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

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

function statusBadgeClass(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    case "PROCESSING":
      return "bg-blue-50 text-blue-800 ring-blue-200";
    case "SHIPPED":
      return "bg-indigo-50 text-indigo-800 ring-indigo-200";
    case "DELIVERED":
      return "bg-green-50 text-green-800 ring-green-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700 ring-gray-200";
    default:
      return "bg-orange-50 text-orange-800 ring-orange-200";
  }
}

function OrderLineImage({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string;
}) {
  const src = imageUrl?.trim();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400 sm:h-24 sm:w-24">
        <Package className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 sm:h-24 sm:w-24">
      <Image
        src={src}
        alt={name}
        fill
        sizes="96px"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
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
        const data = e.response?.data as
          | { message?: string | string[] }
          | undefined;
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
        const data = e.response?.data as
          | { message?: string | string[] }
          | undefined;
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-600">
        Đang chuyển đến trang đăng nhập…
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Đơn hàng không hợp lệ.</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Đơn hàng của tôi", href: "/account/orders" },
    {
      label: order ? `Đơn #${order.orderNumber}` : "Chi tiết đơn hàng",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
          Chi tiết đơn hàng
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              <Link
                href="/account/orders"
                className="mt-2 inline-block text-orange-600 hover:underline"
              >
                Quay lại danh sách đơn hàng
              </Link>
            </div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Thông tin đơn */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Hash className="h-4 w-4" />
                      Mã đơn hàng
                    </p>
                    <p className="mt-1 font-mono text-xl font-bold text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${statusBadgeClass(order.status)}`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  Địa chỉ giao hàng
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                  {order.shippingAddress || "—"}
                </p>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <h2 className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-3.5 text-sm font-semibold text-gray-900">
                <Package className="h-4 w-4 text-orange-500" />
                Sản phẩm ({order.items.length})
              </h2>
              <ul className="divide-y divide-gray-100">
                {order.items.map((line) => (
                  <li key={line.id} className="px-4 py-4 sm:px-6">
                    <div className="flex gap-4">
                      <Link
                        href={`/products/${line.productId}`}
                        className="shrink-0"
                      >
                        <OrderLineImage
                          name={line.productName}
                          imageUrl={line.imageUrl}
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${line.productId}`}
                          className="font-medium text-gray-900 hover:text-orange-600 line-clamp-2"
                        >
                          {line.productName}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">
                          {line.quantity} × {formatPrice(line.price)}
                        </p>
                        <p className="mt-2 text-base font-semibold text-gray-900 sm:hidden">
                          {formatPrice(line.subtotal)}
                        </p>
                      </div>
                      <p className="hidden shrink-0 text-base font-semibold text-gray-900 sm:block">
                        {formatPrice(line.subtotal)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
                <span className="text-base font-semibold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-xl font-bold text-orange-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {order.status === "PENDING" ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancel}
                  className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelling ? "Đang hủy…" : "Hủy đơn hàng"}
                </button>
                <Link
                  href="/account/orders"
                  className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Quay lại danh sách
                </Link>
              </div>
            ) : (
              <Link
                href="/account/orders"
                className="inline-flex rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Quay lại danh sách đơn hàng
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
