import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductList from "@/components/products/ProductList";
import ChooseUs from "@/components/ChooseUs";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function Home() {
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

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CtaSection />
      <Footer />
    </div>
  );
}
