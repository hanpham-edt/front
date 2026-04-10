"user client";
import React from "react";
import Link from "next/link";

export default function RecentOrders() {
  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Nguyễn Thị Anh",
      product: "Yến Sào Huyết Đỏ Premium",
      amount: "2.500.000 VNĐ",
      status: "Đã giao",
      date: "2024-01-15",
    },
    {
      id: "#ORD-002",
      customer: "Trần Văn Bình",
      product: "Yến Sào Trắng Tinh Khiết",
      amount: "1.800.000 VNĐ",
      status: "Đang xử lý",
      date: "2024-01-14",
    },
    {
      id: "#ORD-003",
      customer: "Lê Thị Cẩm",
      product: "Yến Sào Vàng Hồng",
      amount: "1.200.000 VNĐ",
      status: "Đã giao",
      date: "2024-01-13",
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Đơn hàng gần đây
            </h3>
            <Link
              href="/admin/orders"
              className="text-sm text-orange-600 hover:text-orange-500"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.id}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {order.customer} - {order.product}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    {order.amount}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "Đã giao"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
