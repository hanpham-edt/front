import DOMPurify from "isomorphic-dompurify";

const ARTICLE_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "hr",
  "span",
];

const ARTICLE_ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "class",
  "style",
];

export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ARTICLE_ALLOWED_TAGS,
    ALLOWED_ATTR: ARTICLE_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

/** Độ dài text thuần (bỏ thẻ HTML) — dùng validate nội dung bài viết */
export function getPlainTextLength(html: string): number {
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || "").replace(/\s+/g, " ").trim().length;
  }
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

/** Nội dung có thẻ HTML (từ editor), khác plain text cũ */
export function isHtmlContent(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

export function isEmptyArticleHtml(html: string): boolean {
  const stripped = html
    .replace(/<p><br><\/p>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
  return getPlainTextLength(stripped) === 0;
}
