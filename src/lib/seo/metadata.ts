import type { Metadata } from "next";
import type { Article } from "@/types/article-types";
import type { PolicyPage } from "@/types/policy-types";
import type { Product } from "@/types/product-types";
import type { PublicSiteInfo } from "@/types/settings-types";
import { getProductPrimaryImageUrl } from "@/lib/product-images";
import { resolveStoredImageUrl } from "@/lib/image-url";
import { htmlToPlainText, truncateDescription } from "@/lib/seo/plain-text";
import { fetchPublicSiteInfo } from "@/lib/seo/server-fetch";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/seo/site-url";

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export async function getSiteMetadataBase(): Promise<Metadata> {
  const site = await fetchPublicSiteInfo();
  const siteUrl = getSiteUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.siteName,
      template: `%s | ${site.siteName}`,
    },
    description: site.siteDescription,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.siteName,
      title: site.siteName,
      description: site.siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: site.siteName,
      description: site.siteDescription,
    },
    alternates: {
      canonical: "/",
    },
  };
}

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

function buildOpenGraphImages(imageUrl?: string | null): NonNullable<Metadata["openGraph"]>["images"] {
  const absolute = toAbsoluteUrl(
    imageUrl ? resolveStoredImageUrl(imageUrl) : undefined,
  );
  if (!absolute) return undefined;
  return [{ url: absolute, alt: "" }];
}

export function buildPageMetadata(
  site: PublicSiteInfo,
  input: PageMetaInput,
): Metadata {
  const canonicalPath = input.path ?? "/";
  const images = buildOpenGraphImages(input.imageUrl);

  return {
    title: input.title,
    description: input.description,
    robots: input.noIndex ? NOINDEX_ROBOTS : undefined,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: input.type ?? "website",
      locale: "vi_VN",
      siteName: site.siteName,
      title: input.title,
      description: input.description,
      url: canonicalPath,
      ...(input.publishedTime
        ? { publishedTime: input.publishedTime }
        : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
    },
  };
}

export async function buildStaticPageMetadata(
  pageTitle: string,
  description: string,
  path: string,
  options?: { noIndex?: boolean },
): Promise<Metadata> {
  const site = await fetchPublicSiteInfo();
  return buildPageMetadata(site, {
    title: pageTitle,
    description: truncateDescription(description),
    path,
    noIndex: options?.noIndex,
  });
}

export function buildProductMetadata(
  site: PublicSiteInfo,
  product: Product,
): Metadata {
  const title = product.metaTitle?.trim() || product.name;
  const description = truncateDescription(
    product.metaDescription?.trim() ||
      htmlToPlainText(product.description) ||
      site.siteDescription,
  );
  const imageUrl = getProductPrimaryImageUrl(product);

  return buildPageMetadata(site, {
    title,
    description,
    path: `/products/${product.id}`,
    imageUrl: imageUrl || undefined,
  });
}

export function buildArticleMetadata(
  site: PublicSiteInfo,
  article: Article,
): Metadata {
  const title = article.metaTitle?.trim() || article.title;
  const description = truncateDescription(
    article.metaDescription?.trim() ||
      article.excerpt?.trim() ||
      htmlToPlainText(article.content) ||
      site.siteDescription,
  );

  return buildPageMetadata(site, {
    title,
    description,
    path: `/news/${article.slug}`,
    imageUrl: article.imageUrl,
    type: "article",
    publishedTime: article.publishedAt ?? article.createdAt,
  });
}

export function buildPolicyMetadata(
  site: PublicSiteInfo,
  page: PolicyPage,
  canonicalPath?: string,
): Metadata {
  const description = truncateDescription(
    htmlToPlainText(page.content) || site.siteDescription,
  );

  return buildPageMetadata(site, {
    title: page.title,
    description,
    path: canonicalPath ?? `/policies/${page.slug}`,
  });
}
