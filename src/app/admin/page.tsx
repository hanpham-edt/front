"use client";

import { RefreshCw } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import StatsGrid from "./components/StatsGrid";
import OrderStatusOverview from "./components/OrderStatusOverview";
import RecentOrders from "./components/RecentOrders";
import TopProducts from "./components/TopProducts";
import LowStockAlert from "./components/LowStockAlert";
import QuickActions from "./components/QuickActions";

export default function AdminDashboard() {
  const { stats, isLoading, error, refresh } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Tổng quan hoạt động kinh doanh — cập nhật theo thời gian thực từ hệ
            thống
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <StatsGrid overview={stats?.overview} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <OrderStatusOverview
            ordersByStatus={stats?.ordersByStatus ?? []}
            isLoading={isLoading}
          />
        </div>
        <div className="xl:col-span-2">
          <RecentOrders
            orders={stats?.recentOrders ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProducts products={stats?.topProducts ?? []} isLoading={isLoading} />
        <LowStockAlert
          products={stats?.lowStockProducts ?? []}
          totalCount={stats?.overview?.lowStockCount ?? 0}
          isLoading={isLoading}
        />
      </div>

      <QuickActions
        pendingOrders={stats?.overview?.pendingOrders}
        pendingContacts={stats?.overview?.pendingContacts}
      />
    </div>
  );
}
