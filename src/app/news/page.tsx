"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { articleService } from "@/services/api/articleService";
import type { Article } from "@/types/article-types";

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await articleService.getPublished({ page, limit: 9 });
      setArticles(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Tin tức</h1>
          <p className="mb-8 text-gray-600">
            Cập nhật kiến thức và tin tức về yến sào
          </p>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : articles.length === 0 ? (
            <p className="rounded-lg bg-white py-16 text-center text-gray-500 shadow-sm">
              Chưa có bài viết nào.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/news/${a.slug}`}
                  className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-gray-100">
                    {a.imageUrl ? (
                      <Image
                        src={a.imageUrl}
                        alt={a.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Không có ảnh
                      </div>
                    )}
                  </div>
                  <div className="p-4">
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
      <Footer />
    </>
  );
}
