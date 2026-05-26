import type { Metadata } from "next";
import Header from "@/components/Header";
import AboutPage from "./About";
import Footer from "@/components/Footer";
import { buildStaticPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(
    "Về chúng tôi",
    "Tìm hiểu về thương hiệu, quy trình và cam kết chất lượng yến sào.",
    "/about",
  );
}

export default function page() {
  return (
    <>
      <Header />
      <AboutPage />
      <Footer />
    </>
  );
}
