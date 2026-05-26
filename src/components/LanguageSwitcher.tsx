"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";

const localeLabels: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
};

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="group"
      aria-label={t("language")}
    >
      <Globe className="hidden h-4 w-4 text-gray-500 sm:block" aria-hidden />
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            locale === loc
              ? "bg-orange-500 text-white"
              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
          }`}
          aria-pressed={locale === loc}
          title={loc === "vi" ? t("vietnamese") : t("english")}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
