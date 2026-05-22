"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import type { CreateArticle } from "@/types/article-types";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  getPlainTextLength,
  isEmptyArticleHtml,
} from "@/lib/html-content";
import {
  uploadProductImageFile,
  isStoredImageUrl,
} from "@/utils/productImageUpload";

const MIN_CONTENT_LENGTH = 10;

type ArticleFormProps = {
  initial: CreateArticle;
  submitLabel: string;
  onSubmit: (data: CreateArticle) => Promise<void>;
};

export default function ArticleForm({
  initial,
  submitLabel,
  onSubmit,
}: ArticleFormProps) {
  const [form, setForm] = useState<CreateArticle>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImageFile(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch {
      alert("Upload ảnh thất bại.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const title = form.title.trim();
    const content = form.content.trim();

    if (title.length < 3) {
      setError("Tiêu đề phải có ít nhất 3 ký tự.");
      return;
    }
    if (isEmptyArticleHtml(content)) {
      setError("Vui lòng nhập nội dung bài viết.");
      return;
    }
    if (getPlainTextLength(content) < MIN_CONTENT_LENGTH) {
      setError(
        `Nội dung phải có ít nhất ${MIN_CONTENT_LENGTH} ký tự chữ (không tính thẻ định dạng).`,
      );
      return;
    }
    if (form.imageUrl && !isStoredImageUrl(form.imageUrl)) {
      setError("Vui lòng upload ảnh bìa (lưu vào /images/).");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        title,
        content,
        excerpt: form.excerpt?.trim() || undefined,
        slug: form.slug?.trim() || undefined,
        imageUrl: form.imageUrl?.trim() || undefined,
      });
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, "Không lưu được bài viết. Vui lòng thử lại."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      {error ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tiêu đề *
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Slug (tùy chọn)
        </label>
        <input
          value={form.slug ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="tu-dong-tu-tieu-de"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tóm tắt
        </label>
        <textarea
          rows={2}
          value={form.excerpt ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nội dung *
        </label>
        <RichTextEditor
          value={form.content}
          onChange={(html) => setForm((f) => ({ ...f, content: html }))}
          minLength={MIN_CONTENT_LENGTH}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Ảnh bìa
        </label>
        {form.imageUrl && isStoredImageUrl(form.imageUrl) ? (
          <div className="relative mb-2 h-40 w-full max-w-md overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={form.imageUrl}
              alt="Bìa"
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-orange-400">
          <Upload className="h-4 w-4" />
          {uploading ? "Đang tải..." : "Chọn ảnh"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => void handleImage(e)}
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={!!form.isPublished}
          onChange={(e) =>
            setForm((f) => ({ ...f, isPublished: e.target.checked }))
          }
          className="h-4 w-4 rounded border-gray-300 text-orange-600"
        />
        <label htmlFor="isPublished" className="text-sm text-gray-700">
          Xuất bản (hiển thị trên trang Tin tức)
        </label>
      </div>
      <button
        type="submit"
        disabled={saving || uploading}
        className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </button>
    </form>
  );
}
