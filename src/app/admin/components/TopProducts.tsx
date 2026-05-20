"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { DashboardTopProduct } from "@/types/dashboard-types";
import { formatCurrency, formatNumber } from "@/lib/format";

interface TopProductsProps {
  products: DashboardTopProduct[];
  isLoading?: boolean;
}

export default function TopProducts({ products, isLoading }: TopProductsProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-orange-600 hover:text-orange-500"
        >
          Xem tất cả
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4 px-6 py-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-100" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-gray-500">
          Chưa có dữ liệu bán hàng
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 px-6 py-4">
              <span className="w-6 shrink-0 text-center text-sm font-bold text-orange-500">
                #{index + 1}
              </span>
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <Package className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatNumber(product.soldQuantity)} đã bán
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-900">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
