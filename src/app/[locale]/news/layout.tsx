import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata(
    "Tin tức",
    "Cập nhật tin tức, kiến thức và thông tin mới nhất về yến sào.",
    "/news",
  );
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
