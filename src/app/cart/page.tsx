"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store";
import { useSelector } from "react-redux";
import type { IRootState } from "@/store";
import { removeFromCart, setQuantity } from "@/store/slices/cartSlice";

const SHIPPING_FLAT = 50_000;
const FREE_SHIPPING_FROM = 2_000_000;

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useSelector((s: IRootState) => s.cart.items);
  const subtotal = useSelector((s: IRootState) => s.cart.totalPrice);

  const shipping =
    subtotal >= FREE_SHIPPING_FROM ? 0 : items.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const updateQuantity = (productId: string, newQuantity: number) => {
    dispatch(setQuantity({ productId, quantity: newQuantity }));
  };

  const removeItem = (productId: string) => {
    dispatch(removeFromCart({ productId }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <Link href="/products">
              <button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link
            href="/products"
            className="flex items-center text-gray-600 hover:text-orange-500 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Giỏ hàng ({items.length} loại)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => {
                const maxQty = Math.max(1, item.product.stock || 0);
                const canIncrease = item.quantity < maxQty && item.product.stock > 0;

                return (
                  <div
                    key={item.productId}
                    className="p-6 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-4">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gradient-to-br from-yellow-50 to-orange-50"
                      >
                        {item.product.imageUrl?.trim() ? (
                          <Image
                            src={item.product.imageUrl.trim()}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            —
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-orange-600">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mb-2">
                          SKU: {item.product.sku}
                          {item.product.category ? (
                            <span> · {item.product.category}</span>
                          ) : null}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-lg font-bold text-orange-600">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.stock <= 0 ? (
                            <span className="text-sm text-red-600">Hết hàng</span>
                          ) : (
                            <span className="text-sm text-green-600">
                              Còn {item.product.stock}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={!canIncrease}
                            className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          aria-label="Xóa khỏi giỏ"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {subtotal > 0 && subtotal < FREE_SHIPPING_FROM ? (
                  <p className="text-xs text-gray-500">
                    Mua thêm{" "}
                    <span className="font-medium text-orange-600">
                      {formatPrice(FREE_SHIPPING_FROM - subtotal)}
                    </span>{" "}
                    để được miễn phí vận chuyển.
                  </p>
                ) : null}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Tiến hành thanh toán
                </button>
                <p className="text-center text-xs text-gray-500">
                  Giỏ hàng được lưu tự động trên trình duyệt của bạn.
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Thông tin vận chuyển
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Giao hàng toàn quốc</p>
                  <p>• Thời gian giao hàng: 1-3 ngày</p>
                  <p>
                    • Miễn phí vận chuyển cho đơn từ{" "}
                    {formatPrice(FREE_SHIPPING_FROM)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
