"use client";
import React from "react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="mt-4 bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Thao tác nhanh</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products/new">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer">
              Thêm sản phẩm
            </button>
          </Link>
          <Link href="/admin/orders">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer">
              Xem đơn hàng
            </button>
          </Link>
          <Link href="/admin/users">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer">
              Quản lý người dùng
            </button>
          </Link>
          <Link href="/admin/settings">
            <button className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer">
              Cài đặt
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
