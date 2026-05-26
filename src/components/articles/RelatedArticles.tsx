"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";
import { articleService } from "@/services/api/articleService";
import type { Article } from "@/types/article-types";

const RELATED_LIMIT = 5;

type RelatedArticlesProps = {
  articleId: string;
  topicId?: string | null;
  topicSlug?: string | null;
};

export default function RelatedArticles({
  articleId,
  topicId,
  topicSlug,
}: RelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const excludeCurrent = (list: Article[]) =>
        list.filter((a) => a.id !== articleId);

      let items: Article[] = [];

      if (topicId || topicSlug) {
        const byTopic = await articleService.getPublished({
          page: 1,
          limit: RELATED_LIMIT + 1,
          topicId: topicId ?? undefined,
          topicSlug: topicSlug ?? undefined,
        });
        items = excludeCurrent(byTopic.data).slice(0, RELATED_LIMIT);
      }

      if (items.length === 0) {
        const fallback = await articleService.getPublished({
          page: 1,
          limit: RELATED_LIMIT + 1,
        });
        items = excludeCurrent(fallback.data).slice(0, RELATED_LIMIT);
      }

      setArticles(items);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [articleId, topicId, topicSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!loading && articles.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-lg bg-gray-50 p-5 lg:sticky lg:top-24">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-emerald-800">
        Tin liên quan
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      ) : (
        <ul className="divide-y divide-dashed divide-gray-300">
          {articles.map((item) => (
            <li key={item.id}>
              <Link
                href={`/news/${item.slug}`}
                className="group flex gap-3 py-4 first:pt-0 last:pb-0"
              >
                <ArticleCoverImage
                  src={item.imageUrl}
                  alt={item.title}
                  sizes="96px"
                  className="relative h-[4.5rem] w-24 shrink-0 overflow-hidden rounded bg-gray-100"
                  imageClassName="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-orange-600">
                    {item.title}
                  </h3>
                  {item.excerpt ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                      {item.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
