import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yến Sào A Phú Hãn - Chất Lượng Cao, Dinh Dưỡng Tốt",
  description:
    "Chuyên cung cấp yến sào chất lượng cao, được thu hoạch từ những đảo yến tự nhiên với quy trình chế biến nghiêm ngặt.",
  keywords:
    "yến sào, yến sào a phú hãn, yến sào huyết đỏ, yến sào trắng, dinh dưỡng, sức khỏe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
