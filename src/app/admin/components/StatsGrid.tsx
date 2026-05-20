"use client";

import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import type { DashboardOverview } from "@/types/dashboard-types";
import { formatCurrency, formatGrowthPercent, formatNumber } from "@/lib/format";

interface StatsGridProps {
  overview?: DashboardOverview;
  isLoading?: boolean;
}

function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="h-4 w-24 rounded bg-gray-200" />
      <div className="mt-4 h-8 w-32 rounded bg-gray-200" />
      <div className="mt-4 h-3 w-20 rounded bg-gray-100" />
    </div>
  );
}

function GrowthBadge({
  value,
  label = "so với tháng trước",
}: {
  value: number | null;
  label?: string;
}) {
  if (value === null) {
    return <span className="text-sm text-gray-500">{label}</span>;
  }
  const isUp = value >= 0;
  return (
    <div className="flex items-center gap-1.5 text-sm">
      {isUp ? (
        <TrendingUp className="h-4 w-4 text-emerald-500" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-500" />
      )}
      <span className={`font-medium ${isUp ? "text-emerald-600" : "text-red-600"}`}>
        {formatGrowthPercent(value)}
      </span>
      <span className="text-gray-500">{label}</span>
    </div>
  );
}

export default function StatsGrid({ overview, isLoading }: StatsGridProps) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  const stats = [
    {
      name: "Tổng doanh thu",
      value: formatCurrency(overview.totalRevenue),
      sub: `Tháng này: ${formatCurrency(overview.revenueThisMonth)}`,
      growth: overview.revenueGrowthPercent,
      icon: DollarSign,
      accent: "from-amber-500 to-orange-500",
    },
    {
      name: "Đơn hàng",
      value: formatNumber(overview.totalOrders),
      sub: `${formatNumber(overview.ordersThisMonth)} đơn tháng này`,
      growth: overview.ordersGrowthPercent,
      icon: ShoppingCart,
      accent: "from-blue-500 to-indigo-500",
    },
    {
      name: "Sản phẩm",
      value: formatNumber(overview.totalProducts),
      sub: `${formatNumber(overview.activeProducts)} đang bán`,
      growth: null,
      icon: Package,
      accent: "from-violet-500 to-purple-500",
    },
    {
      name: "Khách hàng",
      value: formatNumber(overview.totalUsers),
      sub: `${formatNumber(overview.pendingOrders)} đơn chờ xử lý`,
      growth: null,
      icon: Users,
      accent: "from-emerald-500 to-teal-500",
    },
  ];

  return (
  <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">{stat.sub}</p>
                </div>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} text-white shadow-sm`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-50 bg-gray-50/80 px-5 py-3">
              <GrowthBadge value={stat.growth} />
            </div>
          </div>
        ))}
      </div>

      {(overview.pendingContacts > 0 || overview.lowStockCount > 0) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {overview.pendingOrders > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800 ring-1 ring-amber-200">
              <AlertCircle className="h-4 w-4" />
              {overview.pendingOrders} đơn chờ xác nhận
            </span>
          )}
          {overview.pendingContacts > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800 ring-1 ring-blue-200">
              <MessageSquare className="h-4 w-4" />
              {overview.pendingContacts} liên hệ chưa xử lý
            </span>
          )}
          {overview.lowStockCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm text-red-800 ring-1 ring-red-200">
              <Package className="h-4 w-4" />
              {overview.lowStockCount} sản phẩm sắp hết hàng
            </span>
          )}
        </div>
      )}
    </>
  );
}
