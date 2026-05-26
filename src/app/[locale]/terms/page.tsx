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
    fetchPolicyBySlug(LEGAL_PAGE_SLUGS.terms),
  ]);

  if (!page) {
    return buildStaticPageMetadata(
      "Điều khoản sử dụng",
      "Điều khoản và điều kiện khi sử dụng website và dịch vụ mua sắm.",
      "/terms",
    );
  }

  return buildPolicyMetadata(site, page, "/terms");
}

export default function TermsPage() {
  return <PolicyDetailView slug={LEGAL_PAGE_SLUGS.terms} />;
}
