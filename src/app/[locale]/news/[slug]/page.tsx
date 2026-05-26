import type { Metadata } from "next";
import NewsDetailView from "@/components/news/NewsDetailView";
import {
  buildArticleMetadata,
  buildStaticPageMetadata,
} from "@/lib/seo/metadata";
import {
  fetchArticleBySlug,
  fetchPublicSiteInfo,
} from "@/lib/seo/server-fetch";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [site, article] = await Promise.all([
    fetchPublicSiteInfo(),
    fetchArticleBySlug(slug),
  ]);

  if (!article) {
    return buildStaticPageMetadata("Không tìm thấy bài viết", site.siteDescription, `/news/${slug}`, {
      noIndex: true,
    });
  }

  return buildArticleMetadata(site, article);
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <NewsDetailView slug={slug} />;
}
