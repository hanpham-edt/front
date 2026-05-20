"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Package } from "lucide-react";
import type { DashboardLowStockProduct } from "@/types/dashboard-types";

interface LowStockAlertProps {
  products: DashboardLowStockProduct[];
  totalCount: number;
  isLoading?: boolean;
}

export default function LowStockAlert({
  products,
  totalCount,
  isLoading,
}: LowStockAlertProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Sắp hết hàng</h3>
        </div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-orange-600 hover:text-orange-500"
        >
          Quản lý kho
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : totalCount === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-gray-500">
          Tồn kho ổn định
        </p>
      ) : (
        <>
          <p className="border-b border-amber-100 bg-amber-50 px-6 py-2 text-sm text-amber-800">
            {totalCount} sản phẩm có tồn kho ≤ 10
          </p>
          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-4 px-6 py-3 transition hover:bg-amber-50/40"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    product.stock === 0
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  Còn {product.stock}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
