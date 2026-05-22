"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import ArticleHtmlContent from "@/components/articles/ArticleHtmlContent";
import { articleService } from "@/services/api/articleService";
import type { Article } from "@/types/article-types";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      setArticle(await articleService.getBySlug(slug));
    } catch {
      setArticle(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại tin tức
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : !article ? (
            <p className="text-center text-gray-600">Không tìm thấy bài viết.</p>
          ) : (
            <article className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
              {article.imageUrl ? (
                <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              ) : null}
              <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("vi-VN", {
                      dateStyle: "long",
                    })
                  : new Date(article.createdAt).toLocaleDateString("vi-VN", {
                      dateStyle: "long",
                    })}
              </p>
              {article.excerpt ? (
                <p className="mt-4 text-lg text-gray-600">{article.excerpt}</p>
              ) : null}
              <ArticleHtmlContent html={article.content} className="mt-8" />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
