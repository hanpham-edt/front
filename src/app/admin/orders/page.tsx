"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  Filter,
  Loader2,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import {
  orderService,
  type AdminOrderQueryParams,
} from "@/services/api/orderService";
import type { PaymentMethodCode } from "@/lib/payment-methods";
import type {
  OrderResponse,
  OrderStatusCode,
  PaginatedOrdersResponse,
  PaymentStatusCode,
} from "@/types/order-types";
import { formatOrderStatus } from "@/lib/order-status";
import {
  getPaymentMethodIcon,
  getPaymentMethodLabel,
  getPaymentMethodShortLabel,
  getPaymentStatusClass,
  getPaymentStatusLabel,
  needsPaymentConfirmation,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/payment-methods";

const PAYMENT_METHOD_FILTER: { value: "" | PaymentMethodCode; label: string }[] =
  [
    { value: "", label: "Tất cả PT" },
    { value: "cod", label: "COD" },
    { value: "bank_transfer", label: "Chuyển khoản" },
    { value: "credit_card", label: "Visa/MC" },
    { value: "paypal", label: "PayPal" },
    { value: "atm_card", label: "ATM" },
    { value: "momo", label: "MoMo" },
  ];

const PAYMENT_STATUS_FILTER: {
  value: "" | PaymentStatusCode;
  label: string;
}[] = [
  { value: "", label: "Tất cả TT" },
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "COMPLETED", label: "Đã thanh toán" },
  { value: "FAILED", label: "Thất bại" },
  { value: "REFUNDED", label: "Hoàn tiền" },
];

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

function AdminOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterUserId = searchParams.get("userId")?.trim() ?? "";

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"" | OrderStatusCode>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"" | PaymentMethodCode>("");
  const [paymentStatus, setPaymentStatus] = useState<"" | PaymentStatusCode>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<PaginatedOrdersResponse | null>(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [
    selectedStatus,
    debouncedSearch,
    dateFrom,
    dateTo,
    paymentMethod,
    paymentStatus,
    filterUserId,
    limit,
  ]);

  const buildQueryParams = useCallback(
    (): AdminOrderQueryParams => ({
      page,
      limit,
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(filterUserId ? { userId: filterUserId } : {}),
    }),
    [
      page,
      limit,
      selectedStatus,
      debouncedSearch,
      dateFrom,
      dateTo,
      paymentMethod,
      paymentStatus,
      filterUserId,
    ],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getAllOrders(buildQueryParams());
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
  }, [buildQueryParams]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const params = buildQueryParams();
      const { page: exportPage, limit: exportLimit, ...exportParams } = params;
      void exportPage;
      void exportLimit;
      const blob = await orderService.exportOrdersCsv(exportParams);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `don-hang-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Không xuất được file CSV. Vui lòng thử lại.");
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
    setPaymentMethod("");
    setPaymentStatus("");
    setPage(1);
    router.replace("/admin/orders");
  };

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = useMemo(() => {
    if (!payload) return 1;
    return Math.max(1, Math.ceil(payload.total / payload.limit));
  }, [payload]);

  const handleViewOrder = (order: OrderResponse) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const syncOrderInList = (updated: OrderResponse) => {
    setSelectedOrder(updated);
    setPayload((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.map((o) => (o.id === updated.id ? updated : o)),
      };
    });
  };

  const handleUpdatePaymentStatus = async (next: PaymentStatusCode) => {
    if (!selectedOrder) return;
    setUpdatingPayment(true);
    try {
      const updated = await orderService.updatePaymentAdmin(selectedOrder.id, {
        status: next,
      });
      syncOrderInList(updated);
    } catch (e: unknown) {
      let msg = "Không cập nhật được trạng thái thanh toán.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string | string[] } | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      alert(msg);
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handleUpdateStatus = async (next: OrderStatusCode) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updated = await orderService.updateOrderAdmin(selectedOrder.id, {
        status: next,
      });
      syncOrderInList(updated);
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

      {filterUserId ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          <span>Đang lọc đơn theo một khách hàng cụ thể.</span>
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-orange-700 hover:underline"
          >
            Xóa lọc khách
          </button>
        </div>
      ) : null}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
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
                placeholder="Mã đơn, email khách..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái đơn
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phương thức thanh toán
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "" | PaymentMethodCode)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {PAYMENT_METHOD_FILTER.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái thanh toán
            </label>
            <select
              value={paymentStatus}
              onChange={(e) =>
                setPaymentStatus(e.target.value as "" | PaymentStatusCode)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {PAYMENT_STATUS_FILTER.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex items-end gap-2 lg:col-span-2">
            <button
              type="button"
              onClick={() => void load()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Làm mới
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
            >
              Xóa lọc
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={() => void handleExportCsv()}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Xuất CSV
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
            {(payload?.total ?? 0) > 0
              ? "Không có đơn trên trang này."
              : "Không có đơn hàng nào."}
          </div>
        ) : (
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
                      Thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái đơn
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
                    const PaymentIcon = getPaymentMethodIcon(order.paymentMethod);
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
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                            <PaymentIcon className="h-4 w-4 shrink-0 text-orange-500" />
                            {getPaymentMethodShortLabel(order.paymentMethod)}
                          </div>
                          {order.paymentStatus ? (
                            <span
                              className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getPaymentStatusClass(order.paymentStatus)}`}
                            >
                              {getPaymentStatusLabel(order.paymentStatus)}
                            </span>
                          ) : null}
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
        )}

        {!loading && payload && payload.total > 0 ? (
          <AdminPagination
            page={payload.page}
            totalPages={totalPages}
            total={payload.total}
            limit={payload.limit}
            onPageChange={setPage}
            onLimitChange={(next) => {
              setLimit(next);
              setPage(1);
            }}
          />
        ) : null}
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
              <div className="space-y-6">
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
                      <span className="font-medium">Trạng thái đơn:</span>{" "}
                      {formatOrderStatus(selectedOrder.status)}
                    </div>
                    <div>
                      <span className="font-medium">Địa chỉ giao hàng:</span>
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                        {selectedOrder.shippingAddress || "—"}
                      </p>
                    </div>
                    {selectedOrder.trackingNumber ? (
                      <div>
                        <span className="font-medium">Mã vận đơn:</span>{" "}
                        <span className="font-mono text-purple-700">
                          {selectedOrder.trackingNumber}
                        </span>
                      </div>
                    ) : null}
                    {selectedOrder.notes ? (
                      <div>
                        <span className="font-medium">Ghi chú:</span>
                        <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                          {selectedOrder.notes}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      {(() => {
                        const Icon = getPaymentMethodIcon(
                          selectedOrder.paymentMethod,
                        );
                        return (
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                        );
                      })()}
                      <div>
                        <p className="font-medium text-gray-900">
                          {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                        </p>
                        <p className="text-gray-500">
                          Số tiền:{" "}
                          <span className="font-semibold text-orange-600">
                            {formatPrice(selectedOrder.total)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Trạng thái thanh toán:
                      </span>{" "}
                      {selectedOrder.paymentStatus ? (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusClass(selectedOrder.paymentStatus)}`}
                        >
                          {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                    {selectedOrder.paymentMethod === "bank_transfer" ? (
                      <p className="text-xs text-blue-800 bg-blue-50 rounded-md px-3 py-2">
                        Khách chọn chuyển khoản — xác nhận khi đã nhận tiền, ghi
                        nội dung chuyển khoản là mã đơn{" "}
                        <span className="font-mono font-semibold">
                          {selectedOrder.orderNumber}
                        </span>
                        .
                      </p>
                    ) : null}
                    {selectedOrder.paymentMethod === "momo" ? (
                      <p className="text-xs text-pink-800 bg-pink-50 rounded-md px-3 py-2">
                        Khách chọn MoMo — đối chiếu giao dịch theo mã đơn{" "}
                        <span className="font-mono font-semibold">
                          {selectedOrder.orderNumber}
                        </span>
                        .
                      </p>
                    ) : null}
                    {selectedOrder.paymentMethod === "credit_card" ? (
                      <p className="text-xs text-indigo-800 bg-indigo-50 rounded-md px-3 py-2">
                        Khách chọn thẻ — liên hệ hướng dẫn thanh toán qua cổng thẻ.
                      </p>
                    ) : null}
                    {selectedOrder.paymentMethod === "cod" ? (
                      <p className="text-xs text-amber-800 bg-amber-50 rounded-md px-3 py-2">
                        Khách thanh toán tiền mặt khi nhận hàng (COD).
                      </p>
                    ) : null}

                    {selectedOrder.paymentStatus &&
                    needsPaymentConfirmation(selectedOrder.paymentMethod) &&
                    selectedOrder.paymentStatus === "PENDING" ? (
                      <button
                        type="button"
                        disabled={updatingPayment}
                        onClick={() => void handleUpdatePaymentStatus("COMPLETED")}
                        className="w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {updatingPayment
                          ? "Đang cập nhật..."
                          : "Xác nhận đã nhận tiền"}
                      </button>
                    ) : null}
                  </div>

                  {selectedOrder.paymentStatus ? (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <p className="mb-2 text-xs font-medium text-gray-600">
                        Cập nhật trạng thái thanh toán
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {PAYMENT_STATUS_OPTIONS.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            disabled={
                              updatingPayment ||
                              selectedOrder.paymentStatus === s.value
                            }
                            onClick={() =>
                              void handleUpdatePaymentStatus(s.value)
                            }
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                              selectedOrder.paymentStatus === s.value
                                ? "bg-orange-500 text-white"
                                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                            } disabled:opacity-50`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      {selectedOrder.paymentStatus === "COMPLETED" &&
                      selectedOrder.status === "PROCESSING" &&
                      needsPaymentConfirmation(selectedOrder.paymentMethod) ? (
                        <p className="mt-2 text-xs text-green-700">
                          Đơn đã chuyển sang trạng thái &quot;Đang xử lý&quot; tự
                          động.
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-gray-500">
                      Đơn cũ chưa có bản ghi thanh toán — không thể cập nhật tại
                      đây.
                    </p>
                  )}
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

            <div className="mt-6 flex justify-end border-t pt-4">
              <Link
                href={`/admin/orders/${selectedOrder.id}/edit`}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
              >
                Mở trang sửa đơn
              </Link>
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

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
