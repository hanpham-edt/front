import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildStaticPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(
    "Liên hệ",
    "Liên hệ tư vấn và đặt hàng — chúng tôi sẵn sàng hỗ trợ bạn.",
    "/contact",
  );
}

export default function ContactPage() {
  return (
    <>
     <Header />
      <ContactForm />
      <Footer />
    </>
  );
}