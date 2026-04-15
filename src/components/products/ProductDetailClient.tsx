"use client";
import { useProducts } from "@/hooks/useProducts";
import { useEffect } from "react";
import Breadcrumbs from "./Breadcrumbs";
import ProductDetail from "./ProductDetail";

export default function ProductDetailClient({
  productId,
}: {
  productId: string;
}) {
  const { product, getProduct, isLoading, error } = useProducts();

  useEffect(() => {
    if (productId) {
      getProduct(productId);
    }
  }, [productId, getProduct]);

  if (isLoading && !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-600">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Không tải được sản phẩm. Vui lòng thử lại.
          <div className="mt-2 text-xs text-red-600/80 break-words">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-600">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumbs productName={product.name} />
      <ProductDetail product={product} />
    </div>
  );
}
