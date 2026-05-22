"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { couponService } from "@/services/api/couponService";
import type { Coupon } from "@/types/coupon-types";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n);
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCoupons(await couponService.getAll());
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Xóa mã ${code}?`)) return;
    await couponService.remove(id);
    void load();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
          <p className="text-gray-600">Quản lý khuyến mãi cho khách hàng</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Thêm mã
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Mã
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Đã dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                    {c.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.type === "PERCENT" ? "% đơn" : "Cố định"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {c.type === "PERCENT"
                      ? `${c.value}%`
                      : formatPrice(c.value)}
                    {c.minOrderAmount > 0 ? (
                      <span className="block text-xs text-gray-500">
                        Tối thiểu {formatPrice(c.minOrderAmount)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.usedCount}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.isActive ? "Hoạt động" : "Tắt"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/coupons/${c.id}/edit`}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(c.id, c.code)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && coupons.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            Chưa có mã giảm giá.
          </p>
        ) : null}
      </div>
    </div>
  );
}
