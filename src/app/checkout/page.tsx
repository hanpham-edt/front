"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Banknote, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { useAppDispatch, type IRootState } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { useAuth } from "@/hooks/useAuth";
import { usePersistRehydrated } from "@/hooks/usePersistRehydrated";
import { orderService } from "@/services/api/orderService";

const SHIPPING_FLAT = 50_000;
const FREE_SHIPPING_FROM = 2_000_000;

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rehydrated = usePersistRehydrated();
  const { isAuthenticated } = useAuth();
  const items = useSelector((s: IRootState) => s.cart.items);
  const subtotal = useSelector((s: IRootState) => s.cart.totalPrice);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping =
    subtotal >= FREE_SHIPPING_FROM ? 0 : items.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!rehydrated) return;
    if (!isAuthenticated) {
      router.replace(
        `/auth/login?returnUrl=${encodeURIComponent("/checkout")}`,
      );
    }
  }, [rehydrated, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError("Giỏ hàng trống.");
      return;
    }
    const name = fullName.trim();
    const phoneTrim = phone.trim();
    const addr = address.trim();
    if (!name || !phoneTrim || !addr) {
      setError("Vui lòng nhập đủ họ tên, số điện thoại và địa chỉ giao hàng.");
      return;
    }

    const shippingAddress = [
      `Người nhận: ${name}`,
      `Điện thoại: ${phoneTrim}`,
      `Địa chỉ: ${addr}`,
      note.trim() ? `Ghi chú: ${note.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        items: items.map((row) => ({
          productId: row.productId,
          quantity: row.quantity,
          price: row.product.price,
        })),
        shippingAddress,
      });
      dispatch(clearCart());
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(order.id)}`,
      );
    } catch (err: unknown) {
      let msg = "Không thể đặt hàng. Vui lòng thử lại.";
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as
          | { message?: string | string[] }
          | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      } else if (err instanceof Error) msg = err.message;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!rehydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Đang chuyển đến trang đăng nhập…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-700 mb-6">Giỏ hàng trống — không thể thanh toán.</p>
          <Link
            href="/products"
            className="inline-flex items-center text-orange-600 font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại giỏ hàng
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
        <p className="text-gray-600 mb-8">
          Thanh toán khi nhận hàng (COD). Cổng thanh toán trực tuyến sẽ được bổ sung sau.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6 bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
              <Banknote className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
                <p className="mt-1 text-amber-800/90">
                  Bạn sẽ thanh toán bằng tiền mặt khi shipper giao hàng tới địa chỉ của bạn.
                </p>
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ và tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Địa chỉ giao hàng đầy đủ <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ghi chú (không bắt buộc)
              </label>
              <textarea
                id="note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Giờ giao hàng, hướng dẫn vào nhà, …"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý…
                </>
              ) : (
                "Đặt hàng COD"
              )}
            </button>
          </form>

          <aside className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="font-semibold text-gray-900 mb-4">Đơn hàng</h2>
              <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto mb-4">
                {items.map((row) => (
                  <li
                    key={row.productId}
                    className="flex gap-3 py-3 first:pt-0"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
                      {row.product.imageUrl ? (
                        <Image
                          src={row.product.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-medium text-gray-900 truncate">
                        {row.product.name}
                      </p>
                      <p className="text-gray-500">
                        {row.quantity} × {formatPrice(row.product.price)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                  <span>Tổng cộng</span>
                  <span className="text-orange-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
