"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import ArticleForm from "@/components/admin/ArticleForm";
import { articleService } from "@/services/api/articleService";
import type { CreateArticle } from "@/types/article-types";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");
  const [initial, setInitial] = useState<CreateArticle | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const a = await articleService.getByIdAdmin(id);
      setInitial({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt ?? "",
        content: a.content,
        imageUrl: a.imageUrl ?? "",
        isPublished: a.isPublished,
        publishedAt: a.publishedAt ?? undefined,
        metaTitle: a.metaTitle ?? "",
        metaDescription: a.metaDescription ?? "",
      });
    } catch {
      setInitial(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!initial) {
    return (
      <p className="text-center text-gray-600">
        Không tìm thấy bài viết.{" "}
        <Link href="/admin/news" className="text-orange-600">
          Quay lại
        </Link>
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/news" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Sửa bài viết</h1>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <ArticleForm
          initial={initial}
          submitLabel="Lưu thay đổi"
          onSubmit={async (data) => {
            await articleService.update(id, data);
            router.push("/admin/news");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
