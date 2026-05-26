import { isLegalPageSlug, LEGAL_PAGE_SLUGS } from "./default-legal-pages";

/** URL storefront cho trang chính sách */
export function policyHref(slug: string): string {
  if (slug === LEGAL_PAGE_SLUGS.privacy) return "/privacy";
  if (slug === LEGAL_PAGE_SLUGS.terms) return "/terms";
  return `/policies/${slug}`;
}

export { LEGAL_PAGE_SLUGS, isLegalPageSlug };

/** Gợi ý slug từ tiêu đề (client-side) */
export function slugifyPolicyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
