import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import Benefits from "@/components/Benefits";
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
      <ProductList />

      {/* Benefits Section */}
      <Benefits />

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
