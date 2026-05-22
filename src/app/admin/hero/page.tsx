"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { heroService } from "@/services/api/heroService";
import type { Hero } from "@/types/hero-types";

function formatHeroDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN");
}

export default function AdminHeroPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [heroToDelete, setHeroToDelete] = useState<number | null>(null);

  const loadHeroes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await heroService.getAllAdmin({
        page,
        limit,
        search: debouncedSearch || undefined,
      });
      setHeroes(res.data);
      setMeta(res.meta);
    } catch {
      setHeroes([]);
      setError("Không tải được danh sách Hero.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    void loadHeroes();
  }, [loadHeroes]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      setTimeout(() => setDebouncedSearch(value), 500);
    },
    [],
  );

  const confirmDelete = async () => {
    if (heroToDelete === null) return;
    try {
      await heroService.delete(heroToDelete);
      setShowDeleteModal(false);
      setHeroToDelete(null);
      if (heroes.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadHeroes();
      }
    } catch {
      alert("Xóa thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Hero</h1>
          <p className="text-gray-600">Slide banner trang chủ</p>
        </div>
        <Link href="/admin/hero/new">
          <button
            type="button"
            className="flex cursor-pointer items-center rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm slide mới
          </button>
        </Link>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tìm kiếm
        </label>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Tiêu đề, phụ đề..."
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách ({meta.total})
          </h3>
          {meta.totalPages > 0 ? (
            <p className="text-sm text-gray-600">
              Trang {meta.page} / {meta.totalPages}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : heroes.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-500">
            {debouncedSearch ? (
              "Không tìm thấy slide phù hợp."
            ) : (
              <>
                Chưa có slide.{" "}
                <Link
                  href="/admin/hero/new"
                  className="text-orange-600 hover:underline"
                >
                  Thêm slide đầu tiên
                </Link>
              </>
            )}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Phụ đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Link CTA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Trạng thái public
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Ngày public
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {heroes.map((hero) => (
                  <tr key={hero.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="relative h-14 w-20 overflow-hidden rounded-md bg-gray-100">
                        {hero.imageUrl ? (
                          <Image
                            src={hero.imageUrl}
                            alt={hero.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {hero.title}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-600">
                      {hero.subtitle}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-600">
                      {hero.ctaLink}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          hero.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {hero.isPublished ? "Đã public" : "Nháp"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatHeroDate(hero.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/hero/${hero.id}/edit`}>
                        <button
                          type="button"
                          className="mr-2 inline-flex text-orange-600 hover:text-orange-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroToDelete(hero.id);
                          setShowDeleteModal(true);
                        }}
                        className="inline-flex text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
        />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-gray-600/50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <h3 className="text-center text-lg font-medium">Xác nhận xóa</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Bạn có chắc muốn xóa slide này?
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md bg-gray-300 px-4 py-2"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                className="rounded-md bg-red-600 px-4 py-2 text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
