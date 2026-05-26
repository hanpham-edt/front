"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error";
import { articleTopicService } from "@/services/api/articleTopicService";
import type { ArticleTopic, CreateArticleTopic } from "@/types/article-types";

const emptyForm: CreateArticleTopic = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminArticleTopicsPage() {
  const [topics, setTopics] = useState<ArticleTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateArticleTopic>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await articleTopicService.getAllAdmin();
      setTopics(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Không tải được chủ đề."));
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Tên chủ đề phải có ít nhất 2 ký tự.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: CreateArticleTopic = {
        name: form.name.trim(),
        slug: form.slug?.trim() || undefined,
        description: form.description?.trim() || undefined,
        sortOrder: form.sortOrder ?? 0,
        isActive: form.isActive ?? true,
      };
      if (editingId) {
        await articleTopicService.update(editingId, payload);
      } else {
        await articleTopicService.create(payload);
      }
      resetForm();
      await load();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Không lưu được chủ đề."));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t: ArticleTopic) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      slug: t.slug,
      description: t.description ?? "",
      sortOrder: t.sortOrder,
      isActive: t.isActive,
    });
  };

  const handleDelete = async (t: ArticleTopic) => {
    if (!confirm(`Xóa chủ đề "${t.name}"? Bài viết sẽ không còn chủ đề.`)) return;
    try {
      await articleTopicService.remove(t.id);
      if (editingId === t.id) resetForm();
      await load();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Không xóa được chủ đề."));
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/news" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chủ đề tin tức</h1>
          <p className="text-gray-600">
            Các chủ đề hiển thị trên menu Tin tức và lọc bài viết /news
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {editingId ? "Sửa chủ đề" : "Thêm chủ đề"}
        </h2>
        {error ? (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tên chủ đề *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Slug (tùy chọn)
              </label>
              <input
                value={form.slug ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="tu-dong-tu-ten"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mô tả ngắn
            </label>
            <textarea
              rows={2}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Thứ tự menu
              </label>
              <input
                type="number"
                value={form.sortOrder ?? 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sortOrder: Number(e.target.value) || 0,
                  }))
                }
                className="w-24 rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isActive ?? true}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300 text-orange-600"
              />
              Hiển thị trên menu
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {editingId ? "Lưu chủ đề" : "Thêm chủ đề"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-white shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : topics.length === 0 ? (
          <p className="py-12 text-center text-gray-500">Chưa có chủ đề nào.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Tên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Bài viết
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  TT
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topics.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {t.name}
                    {!t.isActive ? (
                      <span className="ml-2 text-xs text-gray-400">(ẩn)</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">
                    {t.slug}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {t.articleCount ?? 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {t.sortOrder}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(t)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                        aria-label="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(t)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                        aria-label="Xóa"
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
