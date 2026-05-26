"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { articleService } from "@/services/api/articleService";
import type { Article } from "@/types/article-types";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";

const LATEST_COUNT = 6;

export default function HomeLatestNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await articleService.getPublished({
        page: 1,
        limit: LATEST_COUNT,
      });
      setArticles(res.data);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!loading && articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Tin tức mới nhất
            </h2>
            <p className="max-w-2xl text-lg text-gray-600">
              Cập nhật kiến thức và tin tức về yến sào
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-orange-500 px-5 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/news/${a.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
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
                  <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-orange-600">
                    {a.title}
                  </h3>
                  {a.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
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
      </div>
    </section>
  );
}
