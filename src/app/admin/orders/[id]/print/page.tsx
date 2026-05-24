"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { orderService } from "@/services/api/orderService";
import type { OrderResponse } from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";
import { getPaymentMethodLabel } from "@/lib/payment-methods";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n);
}

export default function OrderPrintPage() {
  const params = useParams();
  const orderId = String(params.id ?? "");
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    try {
      setOrder(await orderService.getOrderAdmin(orderId));
    } catch {
      setOrder(null);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!order) {
    return <p className="p-8 text-gray-500">Đang tải hóa đơn...</p>;
  }

  const subtotal = order.subtotal ?? order.total;

  return (
    <div className="mx-auto max-w-3xl p-6 print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/admin/orders/${orderId}/edit`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại sửa đơn
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          <Printer className="h-4 w-4" />
          In hóa đơn
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 print:border-0 print:shadow-none">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">HÓA ĐƠN BÁN HÀNG</h1>
          <p className="mt-1 text-sm text-gray-600">
            Mã đơn: <strong>{order.orderNumber}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Ngày: {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Trạng thái đơn</p>
            <p>{formatOrderStatus(order.status)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Thanh toán</p>
            <p>
              {order.paymentMethod
                ? getPaymentMethodLabel(order.paymentMethod)
                : "—"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm">
          <span className="font-medium text-gray-700">Địa chỉ giao: </span>
          {order.shippingAddress || "—"}
        </p>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2">Sản phẩm</th>
              <th className="py-2 text-right">SL</th>
              <th className="py-2 text-right">Đơn giá</th>
              <th className="py-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">{item.productName}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatPrice(item.price)}</td>
                <td className="py-2 text-right">
                  {formatPrice(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {(order.discount ?? 0) > 0 ? (
            <div className="flex justify-between text-green-700">
              <span>Giảm giá</span>
              <span>-{formatPrice(order.discount!)}</span>
            </div>
          ) : null}
          {(order.shipping ?? 0) > 0 ? (
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(order.shipping!)}</span>
            </div>
          ) : null}
          {(order.tax ?? 0) > 0 ? (
            <div className="flex justify-between">
              <span>VAT</span>
              <span>{formatPrice(order.tax!)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
            <span>Tổng thanh toán</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {order.notes ? (
          <p className="mt-6 text-sm text-gray-600">
            <span className="font-medium">Ghi chú: </span>
            {order.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}
