"use client";

import { sanitizeArticleHtml } from "@/lib/html-content";

type ArticleHtmlContentProps = {
  html: string;
  className?: string;
};

export default function ArticleHtmlContent({
  html,
  className = "",
}: ArticleHtmlContentProps) {
  const safe = sanitizeArticleHtml(html);

  return (
    <div
      className={`article-html-content prose prose-orange max-w-none text-gray-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
