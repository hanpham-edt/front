import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /** Ẩn logo Next.js góc trái khi chạy `npm run dev` */
  devIndicators: false,
};

export default withNextIntl(nextConfig);
