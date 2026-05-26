"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";
import { getApiErrorMessage } from "@/lib/api-error";
import { articleService } from "@/services/api/articleService";
import { articleTopicService } from "@/services/api/articleTopicService";
import type { Article, ArticleTopic } from "@/types/article-types";

/** Gửi API để lọc bài chưa gán chủ đề */
const TOPIC_FILTER_NONE = "__none__";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [topics, setTopics] = useState<ArticleTopic[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await articleService.getAllAdmin({
        page,
        limit,
        search: debouncedSearch || undefined,
        ...(selectedTopicId
          ? { topicId: selectedTopicId }
          : {}),
      });
      setArticles(res.data);
      setMeta(res.meta);
    } catch (err: unknown) {
      setArticles([]);
      setLoadError(
        getApiErrorMessage(err, "Không tải được danh sách bài viết."),
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, selectedTopicId]);

  useEffect(() => {
    void articleTopicService
      .getAllAdmin()
      .then(setTopics)
      .catch(() => setTopics([]));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      setTimeout(() => setDebouncedSearch(value), 500);
    },
    [],
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa bài "${title}"?`)) return;
    await articleService.remove(id);
    if (articles.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      void load();
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tin tức</h1>
          <p className="text-gray-600">Quản lý bài viết trên trang /news</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/news/topics"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Chủ đề tin tức
          </Link>
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Viết bài mới
          </Link>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tiêu đề, slug, tên chủ đề..."
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Chủ đề
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tất cả chủ đề</option>
              <option value={TOPIC_FILTER_NONE}>Chưa gán chủ đề</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {!t.isActive ? " (ẩn)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {loadError}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            Bài viết ({meta.total})
          </h3>
          {meta.totalPages > 0 ? (
            <p className="text-sm text-gray-600">
              Trang {meta.page} / {meta.totalPages}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : articles.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            {debouncedSearch || selectedTopicId
              ? "Không tìm thấy bài viết phù hợp."
              : "Chưa có bài viết."}
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Ảnh bìa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Chủ đề
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
            <tbody className="divide-y divide-gray-200">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <ArticleCoverImage
                      src={a.imageUrl}
                      alt={a.title}
                      sizes="80px"
                      className="relative h-14 w-20 overflow-hidden rounded-lg bg-gray-100"
                      imageClassName="object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">/{a.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {a.topic?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.isPublished ? "Đã xuất bản" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(a.updatedAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/news/${a.id}/edit`}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(a.id, a.title)}
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
    </div>
  );
}
