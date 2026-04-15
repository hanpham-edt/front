import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import React from "react";

// Next.js ISR caching strategy
export const revalidate = false;
interface pageProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: pageProps) {
  const { id } = await params;
  return (
    <>
      <Header />
      <ProductDetailClient productId={id} />
      <Footer />
    </>
  );
}
