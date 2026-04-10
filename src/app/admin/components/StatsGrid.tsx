"use client";
import React from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function StatsGrid() {
  const stats = [
    {
      name: "Tổng doanh thu",
      value: "125.000.000 VNĐ",
      change: "+12%",
      changeType: "increase",
      icon: DollarSign,
    },
    {
      name: "Đơn hàng mới",
      value: "24",
      change: "+8%",
      changeType: "increase",
      icon: ShoppingCart,
    },
    {
      name: "Sản phẩm",
      value: "156",
      change: "+3%",
      changeType: "increase",
      icon: Package,
    },
    {
      name: "Người dùng",
      value: "1,234",
      change: "+15%",
      changeType: "increase",
      icon: Users,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex items-center">
                {stat.changeType === "increase" ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span
                  className={`ml-2 text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  so với tháng trước
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
