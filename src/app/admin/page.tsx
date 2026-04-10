"use client";
import QuickActions from "./components/QuickActions";
import TopProducts from "./components/TopProducts";
import RecentOrders from "./components/RecentOrders";
import StatsGrid from "./components/StatsGrid";

export default function AdminDashboard() {
  // Mock data - in real app this would come from API

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động kinh doanh</p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Recent Orders */}
      <RecentOrders />

      {/* Top Products */}
      <TopProducts />
      {/* Quick Actions */}
      <QuickActions />
    </>
  );
}
