import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import {
  buildProductMetadata,
  buildStaticPageMetadata,
} from "@/lib/seo/metadata";
import {
  fetchProductById,
  fetchPublicSiteInfo,
} from "@/lib/seo/server-fetch";

export const revalidate = false;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [site, product] = await Promise.all([
    fetchPublicSiteInfo(),
    fetchProductById(id),
  ]);

  if (!product) {
    return buildStaticPageMetadata(
      "Không tìm thấy sản phẩm",
      site.siteDescription,
      `/products/${id}`,
      { noIndex: true },
    );
  }

  return buildProductMetadata(site, product);
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
      <Header />
      <ProductDetailClient productId={id} />
      <Footer />
    </>
  );
}
