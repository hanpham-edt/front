import type { Metadata } from "next";
import PolicyDetailView from "@/components/policies/PolicyDetailView";
import {
  buildPolicyMetadata,
  buildStaticPageMetadata,
} from "@/lib/seo/metadata";
import {
  fetchPolicyBySlug,
  fetchPublicSiteInfo,
} from "@/lib/seo/server-fetch";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [site, page] = await Promise.all([
    fetchPublicSiteInfo(),
    fetchPolicyBySlug(slug),
  ]);

  if (!page) {
    return buildStaticPageMetadata(
      "Không tìm thấy trang",
      site.siteDescription,
      `/policies/${slug}`,
      { noIndex: true },
    );
  }

  return buildPolicyMetadata(site, page);
}

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;
  return <PolicyDetailView slug={slug} />;
}
