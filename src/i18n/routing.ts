import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  /** Tiếng Việt: /products — Tiếng Anh: /en/products */
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
