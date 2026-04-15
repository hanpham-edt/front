"use client";
import { Product } from "@/types/product-types";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";

export default function ProductDetail({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "shipping" | "policy">(
    "description",
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isInStock = product.stock > 0;
  const maxQty = Math.max(1, product.stock || 1);

  const images = useMemo(() => {
    const url = (product.imageUrl || "").trim();
    return url ? [url] : [];
  }, [product.imageUrl]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    router.push("/cart");
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                <div className="aspect-square relative bg-gradient-to-br from-yellow-50 to-orange-50">
                  {images[0] ? (
                    <Image
                      src={images[0]}
                      alt={product.name}
                      fill
                      priority
                      className="object-contain p-6"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                      Chưa có hình ảnh
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {(images.length ? images : [null]).slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                    aria-label={`Ảnh ${idx + 1}`}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={`${product.name} - ${idx + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                        —
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  {product.category ? (
                    <Link
                      href="/products"
                      className="rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200"
                    >
                      {product.category}
                    </Link>
                  ) : null}
                  <span className="text-gray-300">•</span>
                  <span>
                    SKU: <span className="font-medium text-gray-800">{product.sku}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span
                    className={`font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}
                  >
                    {isInStock ? `Còn hàng (${product.stock})` : "Hết hàng"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-orange-600">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {/* Quantity + Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Số lượng</span>
                  <div className="flex items-center rounded-md border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-10 w-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      disabled={quantity <= 1}
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      value={quantity}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (!Number.isFinite(n)) return;
                        setQuantity(Math.min(maxQty, Math.max(1, Math.floor(n))));
                      }}
                      className="h-10 w-16 border-x border-gray-200 text-center text-sm outline-none"
                      inputMode="numeric"
                      aria-label="Số lượng"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                      className="h-10 w-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      disabled={!isInStock || quantity >= maxQty}
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className={`w-full rounded-md px-5 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                      isInStock
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!isInStock}
                    className={`w-full rounded-md px-5 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                      isInStock
                        ? "border border-orange-500 text-orange-600 hover:bg-orange-50"
                        : "border border-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Mua ngay
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Truck className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="text-xs text-gray-700">
                      <div className="font-semibold text-gray-900">Giao nhanh</div>
                      1-3 ngày toàn quốc
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <ShieldCheck className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="text-xs text-gray-700">
                      <div className="font-semibold text-gray-900">Chính hãng</div>
                      Cam kết chất lượng
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Undo2 className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="text-xs text-gray-700">
                      <div className="font-semibold text-gray-900">Đổi trả</div>
                      Theo chính sách cửa hàng
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100 px-8 pb-8">
            <div className="flex flex-wrap gap-2 pt-6">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeTab === "description"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Mô tả
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeTab === "shipping"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vận chuyển
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("policy")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeTab === "policy"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đổi trả & bảo hành
              </button>
            </div>

            <div className="mt-6 rounded-lg border border-gray-100 bg-white p-6">
              {activeTab === "description" ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description || "Chưa có mô tả cho sản phẩm này."}
                  </p>
                </div>
              ) : null}

              {activeTab === "shipping" ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Giao hàng toàn quốc.</p>
                  <p>• Thời gian giao hàng dự kiến: 1-3 ngày làm việc (tùy khu vực).</p>
                  <p>• Đơn hàng trên 2.000.000₫ có thể được miễn phí vận chuyển (tùy chương trình).</p>
                </div>
              ) : null}

              {activeTab === "policy" ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Hỗ trợ đổi trả theo điều kiện của cửa hàng.</p>
                  <p>• Sản phẩm phải còn nguyên tem/niêm phong (nếu có) và chưa qua sử dụng.</p>
                  <p>• Vui lòng liên hệ để được hướng dẫn trước khi gửi đổi trả.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
