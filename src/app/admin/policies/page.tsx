"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Edit, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error";
import { policyHref } from "@/lib/policy-pages";
import { policyService } from "@/services/api/policyService";
import type { PolicyPage } from "@/types/policy-types";

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<PolicyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPolicies(await policyService.getAllAdmin());
    } catch (err: unknown) {
      setPolicies([]);
      setError(getApiErrorMessage(err, "Không tải được danh sách chính sách."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (p: PolicyPage) => {
    if (!confirm(`Xóa trang "${p.title}"?`)) return;
    try {
      await policyService.remove(p.slug);
      await load();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Không xóa được trang."));
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trang chính sách</h1>
          <p className="text-gray-600">
            Thêm hoặc chỉnh sửa các trang chính sách — hiển thị trên footer.
            Trang pháp lý:{" "}
            <Link href="/privacy" className="text-orange-600 hover:underline" target="_blank">
              /privacy
            </Link>
            {", "}
            <Link href="/terms" className="text-orange-600 hover:underline" target="_blank">
              /terms
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/policies/new"
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Thêm trang mới
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : policies.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            Chưa có trang chính sách.{" "}
            <Link href="/admin/policies/new" className="text-orange-600">
              Tạo trang đầu tiên
            </Link>
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  TT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Trang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Cập nhật
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {policies.map((p) => (
                <tr key={p.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.sortOrder ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <p className="font-mono text-xs text-gray-500">{p.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.isPublished ? "Công khai" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.updatedAt
                      ? new Date(p.updatedAt).toLocaleString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      {p.isPublished ? (
                        <a
                          href={policyHref(p.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-orange-600"
                          title="Xem trang"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                      <Link
                        href={`/admin/policies/${p.slug}/edit`}
                        className="text-orange-600 hover:text-orange-800"
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(p)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
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
      </div>
    </div>
  );
}
