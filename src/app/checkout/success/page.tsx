"use client";

import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { orderService } from "@/services/api/orderService";
import type { OrderResponse } from "@/types/order-types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Thiếu mã đơn hàng.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await orderService.getOrder(orderId);
        if (!cancelled) setOrder(data);
      } catch {
        if (!cancelled) setError("Không tải được thông tin đơn hàng.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="text-center text-gray-600">
        <p>Không tìm thấy đơn hàng.</p>
        <Link href="/products" className="mt-4 inline-block text-orange-600 font-medium">
          Về cửa hàng
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-700">{error}</p>
        <Link href="/products" className="mt-4 inline-block text-orange-600 font-medium">
          Về cửa hàng
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công</h1>
      <p className="text-gray-600 mb-6">
        Cảm ơn bạn đã mua hàng. Đơn của bạn đang ở trạng thái{" "}
        <span className="font-medium text-gray-800">chờ xác nhận</span>. Shipper sẽ liên hệ
        và giao hàng; bạn thanh toán bằng tiền mặt khi nhận (COD).
      </p>
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm mb-8">
        <p>
          <span className="text-gray-500">Mã đơn:</span>{" "}
          <span className="font-mono font-semibold text-gray-900">{order.orderNumber}</span>
        </p>
        <p className="mt-2">
          <span className="text-gray-500">Tổng thanh toán:</span>{" "}
          <span className="font-semibold text-orange-600">{formatPrice(order.total)}</span>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="inline-flex justify-center rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/"
          className="inline-flex justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
