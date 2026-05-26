import type { Metadata } from "next";
import CartForm from "@/components/cart/CartForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { buildStaticPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata("Giỏ hàng", "Xem và chỉnh sửa giỏ hàng của bạn.", "/cart", {
    noIndex: true,
  });
}

export default function page() {
  return (
    <>
      <Header />

      <CartForm />

      <Footer />
    </>
  );
}
