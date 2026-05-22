"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { orderService } from "@/services/api/orderService";
import type {
  OrderResponse,
  OrderStatusCode,
  PaymentStatusCode,
} from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";
import {
  getPaymentMethodLabel,
  getPaymentStatusClass,
  getPaymentStatusLabel,
  needsPaymentConfirmation,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/payment-methods";

const STATUS_OPTIONS: { value: OrderStatusCode; label: string }[] = [
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

export default function AdminOrderEditPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params.id ?? "");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [refundNote, setRefundNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderStatusCode>("PENDING");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderAdmin(orderId);
      setOrder(data);
      setStatus(data.status as OrderStatusCode);
      setTrackingNumber(data.trackingNumber ?? "");
      setNotes(data.notes ?? "");
    } catch (e: unknown) {
      let msg = "Không tải được đơn hàng.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await orderService.updateOrderAdmin(order.id, {
        status,
        trackingNumber: trackingNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setOrder(updated);
      setStatus(updated.status as OrderStatusCode);
      setTrackingNumber(updated.trackingNumber ?? "");
      setNotes(updated.notes ?? "");
      alert("Đã lưu đơn hàng.");
    } catch (e: unknown) {
      let msg = "Không lưu được đơn hàng.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async () => {
    if (!order) return;
    if (
      !confirm(
        "Xác nhận hoàn tiền? Đơn sẽ chuyển sang Đã hủy, thanh toán Đã hoàn tiền và tồn kho được hoàn lại (nếu chưa hủy trước đó).",
      )
    ) {
      return;
    }
    setRefunding(true);
    try {
      const updated = await orderService.refundOrderAdmin(order.id, {
        note: refundNote.trim() || undefined,
      });
      setOrder(updated);
      setRefundNote("");
      alert("Đã hoàn tiền đơn hàng.");
    } catch (e: unknown) {
      let msg = "Không hoàn tiền được.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      alert(msg);
    } finally {
      setRefunding(false);
    }
  };

  const handleUpdatePaymentStatus = async (next: PaymentStatusCode) => {
    if (!order) return;
    setUpdatingPayment(true);
    try {
      const updated = await orderService.updatePaymentAdmin(order.id, {
        status: next,
      });
      setOrder(updated);
    } catch (e: unknown) {
      let msg = "Không cập nhật được trạng thái thanh toán.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      alert(msg);
    } finally {
      setUpdatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">{error ?? "Không tìm thấy đơn hàng."}</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-block text-orange-600 hover:underline"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sửa đơn {order.orderNumber}
            </h1>
            <p className="text-gray-600">Tạo lúc {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 font-medium text-gray-900">Thông tin giao hàng</h2>
            <p className="whitespace-pre-wrap text-sm text-gray-600">
              {order.shippingAddress || "—"}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 font-medium text-gray-900">Vận chuyển & ghi chú</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mã vận đơn
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="VD: GHN123456789"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Nhập khi đơn chuyển sang trạng thái Đang giao.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Ghi chú nội bộ
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú cho admin, khách không thấy..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 font-medium text-gray-900">Trạng thái đơn</h2>
            <p className="mb-3 text-sm text-gray-600">
              Hiện tại: <strong>{formatOrderStatus(order.status)}</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    status === s.value
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 font-medium text-gray-900">Sản phẩm</h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between rounded bg-gray-50 p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500">SL: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t pt-3 font-bold">
              <span>Tổng cộng</span>
              <span className="text-orange-600">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
            <h2 className="mb-3 font-medium text-gray-900">Thanh toán</h2>
            <p className="text-sm">
              {getPaymentMethodLabel(order.paymentMethod)}
            </p>
            {order.paymentStatus ? (
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusClass(order.paymentStatus)}`}
              >
                {getPaymentStatusLabel(order.paymentStatus)}
              </span>
            ) : (
              <p className="mt-2 text-xs text-gray-500">Chưa có bản ghi thanh toán</p>
            )}

            {order.paymentStatus &&
            needsPaymentConfirmation(order.paymentMethod) &&
            order.paymentStatus === "PENDING" ? (
              <button
                type="button"
                disabled={updatingPayment}
                onClick={() => void handleUpdatePaymentStatus("COMPLETED")}
                className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {updatingPayment ? "Đang cập nhật..." : "Xác nhận đã nhận tiền"}
              </button>
            ) : null}

            {order.paymentStatus === "COMPLETED" ? (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="mb-2 text-xs font-medium text-gray-600">
                  Hoàn tiền
                </p>
                <input
                  type="text"
                  value={refundNote}
                  onChange={(e) => setRefundNote(e.target.value)}
                  placeholder="Ghi chú hoàn tiền (tùy chọn)"
                  className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={refunding}
                  onClick={() => void handleRefund()}
                  className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {refunding ? "Đang xử lý..." : "Hoàn tiền đơn hàng"}
                </button>
              </div>
            ) : null}

            {order.paymentStatus ? (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="mb-2 text-xs font-medium text-gray-600">
                  Cập nhật trạng thái thanh toán
                </p>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      disabled={
                        updatingPayment || order.paymentStatus === s.value
                      }
                      onClick={() => void handleUpdatePaymentStatus(s.value)}
                      className={`rounded-md px-3 py-1 text-xs font-medium ${
                        order.paymentStatus === s.value
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                      } disabled:opacity-50`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
