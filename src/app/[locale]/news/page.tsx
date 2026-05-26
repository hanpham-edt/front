"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { articleService } from "@/services/api/articleService";
import { useArticleTopics } from "@/hooks/useArticleTopics";
import type { Article } from "@/types/article-types";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";

function NewsPageContent() {
  const searchParams = useSearchParams();
  const topicSlug = searchParams.get("topic") ?? "";
  const { topics, getTopics } = useArticleTopics();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const activeTopic = topics.find((t) => t.slug === topicSlug);

  useEffect(() => {
    void getTopics(false);
  }, [getTopics]);

  useEffect(() => {
    setPage(1);
  }, [topicSlug]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await articleService.getPublished({
        page,
        limit: 9,
        ...(topicSlug ? { topicSlug } : {}),
      });
      setArticles(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [page, topicSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {activeTopic ? activeTopic.name : "Tin tức"}
        </h1>
        <p className="mb-6 text-gray-600">
          {activeTopic?.description ??
            "Cập nhật kiến thức và tin tức về yến sào"}
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/news"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !topicSlug
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-orange-50"
            }`}
          >
            Tất cả
          </Link>
          {topics.map((t) => (
            <Link
              key={t.id}
              href={`/news?topic=${t.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                topicSlug === t.slug
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-orange-50"
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : articles.length === 0 ? (
          <p className="rounded-lg bg-white py-16 text-center text-gray-500 shadow-sm">
            {topicSlug
              ? "Chưa có bài viết trong chủ đề này."
              : "Chưa có bài viết nào."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/news/${a.slug}`}
                className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
              >
                <ArticleCoverImage
                  src={a.imageUrl}
                  alt={a.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="p-4">
                  {a.topic ? (
                    <span className="mb-2 inline-block rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                      {a.topic.name}
                    </span>
                  ) : null}
                  <h2 className="font-semibold text-gray-900 group-hover:text-orange-600 line-clamp-2">
                    {a.title}
                  </h2>
                  {a.excerpt ? (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {a.excerpt}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs text-gray-400">
                    {a.publishedAt
                      ? new Date(a.publishedAt).toLocaleDateString("vi-VN")
                      : new Date(a.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-8 flex justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
            >
              Trước
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default function NewsPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="flex min-h-[50vh] items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </main>
        }
      >
        <NewsPageContent />
      </Suspense>
      <Footer />
    </>
  );
}
