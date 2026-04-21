"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  Loader2,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { orderService } from "@/services/api/orderService";
import type {
  OrderResponse,
  OrderStatusCode,
  PaginatedOrdersResponse,
} from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: "" | OrderStatusCode; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const STATUS_BADGE: Record<
  OrderStatusCode,
  { color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  PROCESSING: { color: "bg-blue-100 text-blue-800", icon: Package },
  SHIPPED: { color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function parseCustomerLine(shippingAddress: string) {
  const first = (shippingAddress || "").split("\n")[0]?.trim();
  return first || "—";
}

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"" | OrderStatusCode>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<PaginatedOrdersResponse | null>(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [selectedStatus, debouncedSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getAllOrders({
        page,
        limit: PAGE_SIZE,
        ...(selectedStatus ? { status: selectedStatus } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      setPayload(res);
    } catch (e: unknown) {
      let msg = "Không tải được danh sách đơn hàng.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      setError(msg);
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [page, selectedStatus, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = useMemo(() => {
    if (!payload) return 1;
    return Math.max(1, Math.ceil(payload.total / PAGE_SIZE));
  }, [payload]);

  const handleViewOrder = (order: OrderResponse) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = async (next: OrderStatusCode) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updated = await orderService.updateOrderAdmin(selectedOrder.id, {
        status: next,
      });
      setSelectedOrder(updated);
      setPayload((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((o) => (o.id === updated.id ? updated : o)),
        };
      });
    } catch (e: unknown) {
      let msg = "Không cập nhật được trạng thái.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      alert(msg);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600">Quản lý tất cả đơn hàng của khách hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Tìm theo mã đơn..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as "" | OrderStatusCode)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => void load()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mb-6">
          {error}
        </div>
      ) : null}

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <h3 className="text-lg font-medium text-gray-900">
            Đơn hàng ({payload?.total ?? 0})
          </h3>
          {payload ? (
            <p className="text-sm text-gray-600">
              Trang {payload.page} / {totalPages}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : !payload?.data.length ? (
          <div className="text-center py-16 px-4 text-gray-600">
            Không có đơn hàng nào.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người nhận
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payload.data.map((order) => {
                    const key = (order.status as OrderStatusCode) || "PENDING";
                    const badge = STATUS_BADGE[key] ?? STATUS_BADGE.PENDING;
                    const StatusIcon = badge.icon;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-500">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[260px]">
                            {parseCustomerLine(order.shippingAddress)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(order.total)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} sản phẩm
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {formatOrderStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label="Xem đơn"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <Link href={`/admin/orders/${order.id}/edit`}>
                              <button
                                type="button"
                                className="text-orange-600 hover:text-orange-900"
                                aria-label="Sửa đơn"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <p className="text-sm text-gray-600">
                  Trang {payload.page} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder ? (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết đơn {selectedOrder.orderNumber}
              </h3>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Đóng"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Thông tin đơn hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Mã đơn:</span>{" "}
                    <span className="font-mono">{selectedOrder.orderNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium">Tạo lúc:</span>{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {formatOrderStatus(selectedOrder.status)}
                  </div>
                  <div>
                    <span className="font-medium">Địa chỉ giao hàng:</span>
                    <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                      {selectedOrder.shippingAddress || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sản phẩm</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-medium truncate">
                          {item.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(item.subtotal)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-bold">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-3">
                Cập nhật trạng thái
              </h4>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    disabled={updating || selectedOrder.status === s.value}
                    onClick={() => void handleUpdateStatus(s.value as OrderStatusCode)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedOrder.status === s.value
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
