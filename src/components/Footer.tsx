"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { resolveChatLinks } from "@/lib/chat-links";
import ChatSupportWidget from "@/components/chat/ChatSupportWidget";
import ChatChannelIcon from "@/components/chat/ChatChannelIcon";
import { LEGAL_PAGE_SLUGS } from "@/lib/default-legal-pages";
import { policyHref } from "@/lib/policy-pages";
import { policyService } from "@/services/api/policyService";
import type { PolicyPage } from "@/types/policy-types";

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function ContactRow({
  icon: Icon,
  children,
}: {
  icon: typeof Phone;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" aria-hidden />
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-gray-300">
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const { siteInfo } = usePublicSettings();
  const chatLinks = useMemo(() => resolveChatLinks(siteInfo), [siteInfo]);
  const [policyLinks, setPolicyLinks] = useState<PolicyPage[]>([]);
  const year = new Date().getFullYear();

  useEffect(() => {
    void policyService
      .getAllPublic()
      .then(setPolicyLinks)
      .catch(() => setPolicyLinks([]));
  }, []);

  return (
    <>
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Thương hiệu */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="mb-4 flex items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                <span className="text-lg font-bold text-white">
                  {siteInfo.siteName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="ml-2 text-xl font-bold">{siteInfo.siteName}</span>
            </div>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-gray-400">
              {siteInfo.siteDescription}
            </p>
            <div className="flex gap-3">
              {chatLinks.zalo ? (
                <a
                  href={chatLinks.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 transition hover:opacity-100"
                  aria-label="Zalo"
                >
                  <ChatChannelIcon channel="zalo" className="h-8 w-8" />
                </a>
              ) : null}
              {chatLinks.facebook ? (
                <a
                  href={chatLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 transition hover:opacity-100"
                  aria-label="Facebook Messenger"
                >
                  <ChatChannelIcon channel="facebook" className="h-8 w-8" />
                </a>
              ) : null}
              {chatLinks.whatsapp ? (
                <a
                  href={chatLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 transition hover:opacity-100"
                  aria-label="WhatsApp"
                >
                  <ChatChannelIcon channel="whatsapp" className="h-8 w-8" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 transition-colors hover:text-orange-500"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 transition-colors hover:text-orange-500"
                >
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-300 transition-colors hover:text-orange-500"
                >
                  {t("news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 transition-colors hover:text-orange-500"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 transition-colors hover:text-orange-500"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Chính sách */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold">{t("policies")}</h3>
            <ul className="space-y-2 text-sm">
              {policyLinks.length === 0 ? (
                <li className="text-gray-500">{t("noPolicies")}</li>
              ) : (
                policyLinks
                  .filter(
                    (p) =>
                      p.slug !== LEGAL_PAGE_SLUGS.privacy &&
                      p.slug !== LEGAL_PAGE_SLUGS.terms,
                  )
                  .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={policyHref(p.slug)}
                      className="block text-gray-300 transition-colors hover:text-orange-500"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold">{t("contactSection")}</h3>
            <div className="space-y-3">
              <ContactRow icon={Phone}>
                <a
                  href={telHref(siteInfo.contactPhone)}
                  className="break-all hover:text-orange-400"
                >
                  {siteInfo.contactPhone}
                </a>
              </ContactRow>
              <ContactRow icon={Mail}>
                <a
                  href={`mailto:${siteInfo.contactEmail}`}
                  className="break-all hover:text-orange-400"
                >
                  {siteInfo.contactEmail}
                </a>
              </ContactRow>
              <ContactRow icon={MapPin}>
                <span className="whitespace-pre-line break-words">
                  {siteInfo.address}
                </span>
              </ContactRow>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-400 md:text-left">
              © {year} {siteInfo.siteName}. {t("rights")}
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 transition-colors hover:text-orange-500"
              >
                {t("privacy")}
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 transition-colors hover:text-orange-500"
              >
                {t("terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <ChatSupportWidget />
    </>
  );
}
