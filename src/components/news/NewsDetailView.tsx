"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";
import ArticleHtmlContent from "@/components/articles/ArticleHtmlContent";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { articleService } from "@/services/api/articleService";
import type { Article } from "@/types/article-types";

type Props = {
  slug: string;
};

export default function NewsDetailView({ slug }: Props) {
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <article className="rounded-xl bg-white p-6 shadow-sm sm:p-10">
                {article.imageUrl ? (
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <ArticleCoverImage
                      src={article.imageUrl}
                      alt={article.title}
                      priority
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      className="relative aspect-[16/9] bg-gray-100"
                      imageClassName="object-cover"
                    />
                  </div>
                ) : null}
                {article.topic ? (
                  <Link
                    href={`/news?topic=${article.topic.slug}`}
                    className="mb-3 inline-block rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 hover:bg-orange-100"
                  >
                    {article.topic.name}
                  </Link>
                ) : null}
                <h1 className="text-3xl font-bold text-gray-900">
                  {article.title}
                </h1>
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

              <RelatedArticles
                articleId={article.id}
                topicId={article.topicId}
                topicSlug={article.topic?.slug}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
