import type { Metadata } from "next";
import PolicyDetailView from "@/components/policies/PolicyDetailView";
import {
  buildPolicyMetadata,
  buildStaticPageMetadata,
} from "@/lib/seo/metadata";
import { LEGAL_PAGE_SLUGS } from "@/lib/default-legal-pages";
import {
  fetchPolicyBySlug,
  fetchPublicSiteInfo,
} from "@/lib/seo/server-fetch";

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([
    fetchPublicSiteInfo(),
    fetchPolicyBySlug(LEGAL_PAGE_SLUGS.privacy),
  ]);

  if (!page) {
    return buildStaticPageMetadata(
      "Chính sách bảo mật",
      "Quy định thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng.",
      "/privacy",
    );
  }

  return buildPolicyMetadata(site, page, "/privacy");
}

export default function PrivacyPage() {
  return <PolicyDetailView slug={LEGAL_PAGE_SLUGS.privacy} />;
}
