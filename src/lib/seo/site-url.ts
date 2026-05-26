/** URL gốc storefront (dùng metadataBase, canonical, OG). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/** Gốc API không gồm /api/v1 — phục vụ ảnh /images khi tách domain. */
export function getApiOrigin(): string {
  const api = process.env.NEXT_PUBLIC_API_URL?.trim() || "";
  if (!api) return getSiteUrl();
  return api.replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "");
}

export function toAbsoluteUrl(path: string | null | undefined): string | undefined {
  const trimmed = path?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = trimmed.startsWith("/images/") ? getApiOrigin() : getSiteUrl();
  return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}
