import { cache } from "react";
import type { Article, ArticleListResponse } from "@/types/article-types";
import type { PolicyPage } from "@/types/policy-types";
import type { Product, ProductResponse } from "@/types/product-types";
import type { SettingsMap, SettingsResponse } from "@/types/settings-types";
import { mapPublicSettingsToSiteInfo } from "@/utils/settingsMapper";
import type { PublicSiteInfo } from "@/types/settings-types";

const REVALIDATE_SECONDS = 300;

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

async function serverGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const fetchPublicSiteInfo = cache(async (): Promise<PublicSiteInfo> => {
  const body = await serverGet<SettingsResponse>("/settings/public");
  if (!body?.settings) {
    return mapPublicSettingsToSiteInfo({} as SettingsMap);
  }
  return mapPublicSettingsToSiteInfo(body.settings);
});

export async function fetchProductById(id: string): Promise<Product | null> {
  return serverGet<Product>(`/products/${encodeURIComponent(id)}`);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  return serverGet<Article>(`/articles/slug/${encodeURIComponent(slug)}`);
}

export async function fetchPolicyBySlug(slug: string): Promise<PolicyPage | null> {
  return serverGet<PolicyPage>(`/policies/slug/${encodeURIComponent(slug)}`);
}

export async function fetchPublishedArticlesForSitemap(): Promise<Article[]> {
  const body = await serverGet<ArticleListResponse>(
    "/articles?limit=500&page=1",
  );
  return body?.data ?? [];
}

export async function fetchActiveProductsForSitemap(): Promise<Product[]> {
  const body = await serverGet<ProductResponse>(
    "/products?limit=500&page=1&isActive=true",
  );
  return body?.data ?? [];
}

export async function fetchPublicPoliciesForSitemap(): Promise<PolicyPage[]> {
  return (await serverGet<PolicyPage[]>("/policies")) ?? [];
}
