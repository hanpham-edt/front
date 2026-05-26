"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { MEDIA_FOLDERS } from "@/lib/media-folders";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  getPlainTextLength,
  isEmptyArticleHtml,
} from "@/lib/html-content";
import { slugifyPolicyTitle } from "@/lib/policy-pages";
import type {
  CreatePolicyPage,
  PolicyPage,
  UpdatePolicyPage,
} from "@/types/policy-types";

const MIN_CONTENT_LENGTH = 10;

type PolicyFormProps = {
  mode: "create" | "edit";
  initial: PolicyPage;
  submitLabel: string;
  onSubmit: (data: CreatePolicyPage | UpdatePolicyPage) => Promise<void>;
};

export default function PolicyForm({
  mode,
  initial,
  submitLabel,
  onSubmit,
}: PolicyFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [content, setContent] = useState(initial.content);
  const [sortOrder, setSortOrder] = useState(initial.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initial.isPublished ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (mode === "create" && !slug.trim()) {
      setSlug(slugifyPolicyTitle(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim() || slugifyPolicyTitle(trimmedTitle);
    const trimmedContent = content.trim();

    if (trimmedTitle.length < 3) {
      setError("Tiêu đề phải có ít nhất 3 ký tự.");
      return;
    }
    if (!trimmedSlug) {
      setError("Vui lòng nhập slug (đường dẫn URL).");
      return;
    }
    if (isEmptyArticleHtml(trimmedContent)) {
      setError("Vui lòng nhập nội dung.");
      return;
    }
    if (getPlainTextLength(trimmedContent) < MIN_CONTENT_LENGTH) {
      setError(
        `Nội dung phải có ít nhất ${MIN_CONTENT_LENGTH} ký tự chữ.`,
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: trimmedTitle,
        slug: trimmedSlug,
        content: trimmedContent,
        isPublished,
        sortOrder,
      };
      await onSubmit(payload);
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(err, "Không lưu được. Vui lòng thử lại."),
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
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Slug (URL) *
        </label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
          placeholder="chinh-sach-doi-tra"
        />
        <p className="mt-1 text-xs text-gray-500">
          Đường dẫn: /policies/
          <span className="text-orange-600">{slug || "..."}</span>
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Thứ tự hiển thị (menu/footer)
        </label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nội dung *
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          minLength={MIN_CONTENT_LENGTH}
          mediaFolder={MEDIA_FOLDERS.CONTENT}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-orange-600"
        />
        Hiển thị công khai trên website và footer
      </label>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </button>
    </form>
  );
}
