"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { useAppDispatch, type IRootState } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { useAuth } from "@/hooks/useAuth";
import { usePersistRehydrated } from "@/hooks/usePersistRehydrated";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { orderService } from "@/services/api/orderService";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import {
  getEnabledPaymentMethods,
  type PaymentMethodCode,
} from "@/lib/payment-methods";
import type { PaymentMethodCode as OrderPaymentMethod } from "@/types/order-types";
import { calcShippingFee } from "@/lib/shipping";
import { calcVatAmount } from "@/lib/order-totals";
import { couponService } from "@/services/api/couponService";
import { useSyncServerCart } from "@/hooks/useSyncServerCart";
import { useRefreshCartProductImages } from "@/hooks/useRefreshCartProductImages";
import ProductThumbnail from "@/components/products/ProductThumbnail";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function CheckoutPage() {
  useSyncServerCart();
  useRefreshCartProductImages();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rehydrated = usePersistRehydrated();
  const { isAuthenticated } = useAuth();
  const { paymentOptions, siteInfo, isLoading: settingsLoading } =
    usePublicSettings();
  const items = useSelector((s: IRootState) => s.cart.items);
  const subtotal = useSelector((s: IRootState) => s.cart.totalPrice);

  const enabledMethods = useMemo(
    () => getEnabledPaymentMethods(paymentOptions),
    [paymentOptions],
  );

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCode | "">("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = calcShippingFee(subtotal, items.length, {
    shippingFee: siteInfo.shippingFee,
    freeShippingThreshold: siteInfo.freeShippingThreshold,
  });
  const afterDiscount = Math.max(0, subtotal - discount);
  const taxable = afterDiscount + shipping;
  const tax = calcVatAmount(
    taxable,
    siteInfo.vatEnabled,
    siteInfo.vatRate,
  );
  const total = taxable + tax;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setApplyingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await couponService.validate(code, subtotal);
      if (res.valid && res.discount != null) {
        setAppliedCoupon(res.code ?? code.toUpperCase());
        setDiscount(res.discount);
        setCouponMessage(res.message);
      } else {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponMessage(res.message);
      }
    } catch {
      setAppliedCoupon(null);
      setDiscount(0);
      setCouponMessage("Không áp dụng được mã.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponMessage(null);
    setCouponInput("");
  };

  useEffect(() => {
    if (settingsLoading || enabledMethods.length === 0) return;
    setPaymentMethod((current) => {
      if (current && enabledMethods.some((m) => m.code === current)) {
        return current;
      }
      return enabledMethods[0]?.code ?? "";
    });
  }, [settingsLoading, enabledMethods]);

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
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán.");
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
      const { order, momoPayUrl } = await orderService.createOrder({
        items: items.map((row) => ({
          productId: row.productId,
          ...(row.variantId ? { variantId: row.variantId } : {}),
          quantity: row.quantity,
          price: row.unitPrice,
        })),
        shippingAddress,
        paymentMethod: paymentMethod as OrderPaymentMethod,
        ...(appliedCoupon ? { couponCode: appliedCoupon } : {}),
      });
      dispatch(clearCart());
      if (paymentMethod === "momo" && momoPayUrl) {
        window.location.href = momoPayUrl;
        return;
      }
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
          Chọn phương thức thanh toán và điền thông tin giao hàng.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6 bg-white rounded-lg shadow-sm p-6"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Phương thức thanh toán
              </h2>
              {settingsLoading ? (
                <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
              ) : (
                <PaymentMethodSelector
                  options={paymentOptions}
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  disabled={submitting}
                />
              )}

              {paymentMethod === "bank_transfer" &&
              paymentOptions.bankAccount ? (
                <div className="mt-4 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                  <Building2 className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Thông tin chuyển khoản</p>
                    <p className="mt-1">
                      Ngân hàng: <strong>{paymentOptions.bankName}</strong>
                    </p>
                    <p>
                      Số tài khoản:{" "}
                      <strong className="font-mono">
                        {paymentOptions.bankAccount}
                      </strong>
                    </p>
                    <p className="mt-2 text-blue-800/90">
                      Sau khi đặt hàng, vui lòng chuyển khoản và ghi rõ mã đơn
                      trong nội dung chuyển tiền.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin giao hàng
              </h2>
              <div className="space-y-4">
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
                    Địa chỉ giao hàng đầy đủ{" "}
                    <span className="text-red-500">*</span>
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
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || settingsLoading || !paymentMethod}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý…
                </>
              ) : (
                "Đặt hàng"
              )}
            </button>
          </form>

          <aside className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="font-semibold text-gray-900 mb-4">Đơn hàng</h2>
              <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto mb-4">
                {items.map((row) => (
                  <li
                    key={row.lineKey}
                    className="flex gap-3 py-3 first:pt-0"
                  >
                    <ProductThumbnail
                      name={row.product.name}
                      imageUrl={row.product.imageUrl}
                      imageUrls={row.product.imageUrls}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-medium text-gray-900 truncate">
                        {row.product.name}
                        {row.variantName ? ` — ${row.variantName}` : ""}
                      </p>
                      <p className="text-gray-500">
                        {row.quantity} × {formatPrice(row.unitPrice)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="mb-2 text-sm font-medium text-gray-900">
                  Mã giảm giá
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-green-700">
                      {appliedCoupon}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:underline"
                    >
                      Gỡ
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      placeholder="Nhập mã"
                      className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm uppercase"
                    />
                    <button
                      type="button"
                      disabled={applyingCoupon}
                      onClick={() => void handleApplyCoupon()}
                      className="rounded-md bg-orange-500 px-3 py-1.5 text-sm text-white hover:bg-orange-600 disabled:opacity-50"
                    >
                      {applyingCoupon ? "..." : "Áp dụng"}
                    </button>
                  </div>
                )}
                {couponMessage ? (
                  <p
                    className={`mt-2 text-xs ${
                      appliedCoupon ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {couponMessage}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-green-700">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                ) : null}
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
                {tax > 0 ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      VAT ({siteInfo.vatRate}%)
                    </span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                ) : null}
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
