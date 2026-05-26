/** Chuẩn hóa đường dẫn ảnh cũ /images/file.jpg → /images/news/file.jpg */
export function resolveStoredImageUrl(url?: string | null): string {
  const trimmed = url?.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (!trimmed.startsWith("/images/")) return trimmed;

  const relative = trimmed.slice("/images/".length);
  if (!relative || relative.includes("/")) return trimmed;

  return `/images/news/${relative}`;
}

export function isLocalStoredImage(src: string): boolean {
  return src.startsWith("/images/") || /^https?:\/\//i.test(src);
}
