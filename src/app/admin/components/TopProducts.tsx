"use client";
import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

export default function TopProducts() {
  const topProducts = [
    {
      name: "Yến Sào Huyết Đỏ Premium",
      sales: 45,
      revenue: "112.500.000 VNĐ",
      rating: 4.9,
    },
    {
      name: "Yến Sào Trắng Tinh Khiết",
      sales: 38,
      revenue: "68.400.000 VNĐ",
      rating: 4.8,
    },
    {
      name: "Yến Sào Vàng Hồng",
      sales: 32,
      revenue: "38.400.000 VNĐ",
      rating: 4.7,
    },
  ];
  return (
    <div className="bg-white shadow rounded-lg mt-4">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Sản phẩm bán chạy
          </h3>
          <Link
            href="/admin/products"
            className="text-sm text-orange-600 hover:text-orange-500"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {topProducts.map((product, index) => (
          <div key={product.name} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-6">
                  #{index + 1}
                </span>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {product.sales} đã bán
                </p>
                <p className="text-sm text-gray-500">{product.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
