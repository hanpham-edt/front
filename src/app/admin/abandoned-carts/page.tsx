"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Mail,
  Search,
  ShoppingBag,
} from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import {
  abandonedCartService,
  type AbandonedCart,
} from "@/services/api/abandonedCartService";
import { formatCurrency } from "@/lib/format";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function hoursAgo(iso: string) {
  const h = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60),
  );
  if (h < 1) return "Vừa xong";
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  return `${d} ngày trước`;
}

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [inactiveHours, setInactiveHours] = useState(24);
  const [appliedHours, setAppliedHours] = useState(24);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    inactiveHours: 24,
  });
  const [selected, setSelected] = useState<AbandonedCart | null>(null);
  const [remindingId, setRemindingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await abandonedCartService.getAll({
        page,
        limit,
        search: debouncedSearch || undefined,
        inactiveHours: appliedHours,
      });
      setCarts(res.data);
      setMeta(res.meta);
    } catch {
      setCarts([]);
      setError("Không tải được danh sách giỏ bỏ quên.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, appliedHours]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleRemind = async (cart: AbandonedCart) => {
    if (!confirm(`Gửi email nhắc tới ${cart.customerEmail}?`)) return;
    setRemindingId(cart.id);
    setMessage(null);
    setError(null);
    try {
      const res = await abandonedCartService.sendReminder(cart.id);
      setMessage(res.message);
      void load();
      if (selected?.id === cart.id) {
        setSelected({
          ...cart,
          reminderSentAt: new Date().toISOString(),
        });
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;
      setError(
        typeof msg === "string" ? msg : "Gửi email thất bại. Kiểm tra SMTP.",
      );
    } finally {
      setRemindingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Giỏ bỏ quên</h1>
        <p className="text-gray-600">
          Giỏ của khách đã đăng nhập, có sản phẩm và không hoạt động ít nhất{" "}
          <span className="font-medium text-orange-600">{meta.inactiveHours} giờ</span>
        </p>
      </div>

      {message ? (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tìm khách hàng
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3"
              placeholder="Email hoặc tên..."
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Không hoạt động tối thiểu (giờ)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={720}
              value={inactiveHours}
              onChange={(e) =>
                setInactiveHours(Number(e.target.value) || 24)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={() => {
                setAppliedHours(inactiveHours);
                setPage(1);
              }}
              className="shrink-0 rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600"
            >
              Lọc
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="font-medium text-gray-900">
            {meta.total} giỏ bỏ quên
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : carts.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            Không có giỏ bỏ quên phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    Giá trị
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Cập nhật
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Đã nhắc
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {cart.customerName ?? "—"}
                      </div>
                      <div className="text-gray-500">{cart.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {cart.itemLines} dòng · {cart.totalItems} sp
                    </td>
                    <td className="px-6 py-4 text-right font-medium tabular-nums text-gray-900">
                      {formatCurrency(cart.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>{formatDate(cart.updatedAt)}</div>
                      <div className="text-xs text-gray-400">
                        {hoursAgo(cart.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cart.reminderSentAt ? (
                        <span className="text-xs text-green-700">
                          {formatDate(cart.reminderSentAt)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Chưa gửi</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(cart)}
                          className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleRemind(cart)}
                          disabled={remindingId === cart.id}
                          className="rounded p-2 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                          title="Gửi email nhắc"
                        >
                          {remindingId === cart.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          href={`/admin/orders?userId=${encodeURIComponent(cart.userId)}`}
                          className="rounded p-2 text-gray-500 hover:bg-gray-100"
                          title="Đơn của khách"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 ? (
          <div className="border-t border-gray-200 px-6 py-4">
            <AdminPagination
              page={page}
              total={meta.total}
              totalPages={meta.totalPages}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={(n) => {
                setLimit(n);
                setPage(1);
              }}
            />
          </div>
        ) : null}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết giỏ bỏ quên
              </h3>
              <p className="text-sm text-gray-500">
                {selected.customerName ?? selected.customerEmail}
              </p>
            </div>
            <ul className="divide-y divide-gray-100 px-6">
              {selected.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    {item.variantName ? (
                      <p className="text-sm text-orange-700">
                        {item.variantName}
                      </p>
                    ) : null}
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium tabular-nums text-gray-900">
                    {formatCurrency(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <span className="font-semibold text-gray-900">Tạm tính</span>
              <span className="text-lg font-bold text-orange-600 tabular-nums">
                {formatCurrency(selected.totalPrice)}
              </span>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => void handleRemind(selected)}
                disabled={remindingId === selected.id}
                className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {remindingId === selected.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Gửi email nhắc
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
