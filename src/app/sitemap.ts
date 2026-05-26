import type { MetadataRoute } from "next";
import {
  fetchActiveProductsForSitemap,
  fetchPublicPoliciesForSitemap,
  fetchPublishedArticlesForSitemap,
} from "@/lib/seo/server-fetch";
import { getSiteUrl } from "@/lib/seo/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const [products, articles, policies] = await Promise.all([
    fetchActiveProductsForSitemap(),
    fetchPublishedArticlesForSitemap(),
    fetchPublicPoliciesForSitemap(),
  ]);

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/news/${a.slug}`,
    lastModified: a.updatedAt
      ? new Date(a.updatedAt)
      : a.publishedAt
        ? new Date(a.publishedAt)
        : now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const policyEntries: MetadataRoute.Sitemap = policies.map((p) => ({
    url: `${base}/policies/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productEntries, ...articleEntries, ...policyEntries];
}
