"use client";

import { useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { hasAnyChatLink, resolveChatLinks } from "@/lib/chat-links";
import ChatChannelIcon from "./ChatChannelIcon";

const CHANNELS = [
  { key: "zalo" as const, labelKey: "zalo" as const, hrefKey: "zalo" as const },
  {
    key: "facebook" as const,
    labelKey: "facebook" as const,
    hrefKey: "facebook" as const,
  },
  {
    key: "whatsapp" as const,
    labelKey: "whatsapp" as const,
    hrefKey: "whatsapp" as const,
  },
];

export default function ChatSupportWidget() {
  const t = useTranslations("chat");
  const { siteInfo } = usePublicSettings();
  const [open, setOpen] = useState(false);

  const links = useMemo(() => resolveChatLinks(siteInfo), [siteInfo]);
  const channels = CHANNELS.filter((c) => links[c.hrefKey]);

  if (!hasAnyChatLink(links)) return null;

  return (
    <div
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:right-6"
      aria-live="polite"
    >
      {open && (
        <div
          className="w-[min(100vw-2rem,17rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          role="dialog"
          aria-label={t("title")}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-3">
            <p className="text-sm font-semibold text-white">{t("title")}</p>
            <p className="text-xs text-white/90">{t("subtitle")}</p>
          </div>
          <ul className="divide-y divide-gray-100 p-2">
            {channels.map((channel) => (
              <li key={channel.key}>
                <a
                  href={links[channel.hrefKey]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-orange-50"
                  onClick={() => setOpen(false)}
                >
                  <ChatChannelIcon
                    channel={channel.key}
                    className="h-9 w-9 shrink-0"
                  />
                  {t(channel.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        aria-expanded={open}
        aria-label={open ? t("close") : t("open")}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden />
        ) : (
          <MessageCircle className="h-7 w-7" aria-hidden />
        )}
      </button>
    </div>
  );
}
