import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import Header from "@/components/Header";
import { fetchPublicSiteInfo } from "@/lib/seo/server-fetch";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Hero from "@/components/Hero";
import ProductList from "@/components/products/ProductList";
import ChooseUs from "@/components/ChooseUs";
import HomeLatestNews from "@/components/articles/HomeLatestNews";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const site = await fetchPublicSiteInfo();
  return buildPageMetadata(site, {
    title: site.siteName,
    description: site.siteDescription,
    path: "/",
  });
}

type HomeProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <Header />
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <Suspense
        fallback={
          <section className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12 text-center">
              <div className="mx-auto h-8 max-w-xs animate-pulse rounded bg-gray-200" />
            </div>
          </section>
        }
      >
        <ProductList />
      </Suspense>

      {/* Benefits Section */}
      {/* <Benefits /> */}

      {/* Why Choose Us */}
      <ChooseUs />

      {/* Latest news */}
      <Suspense
        fallback={
          <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4">
              <div className="mx-auto h-8 max-w-xs animate-pulse rounded bg-gray-200" />
            </div>
          </section>
        }
      >
        <HomeLatestNews />
      </Suspense>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CtaSection />
      <Footer />
    </div>
  );
}
