"use client";

import { useTranslations } from "next-intl";
import type { ChatChannelLinks } from "@/lib/chat-links";
import ChatChannelIcon from "./ChatChannelIcon";

const CHANNELS = [
  {
    key: "zalo" as const,
    labelKey: "zalo" as const,
    hrefKey: "zalo" as const,
    ring: "hover:ring-[#0068FF]/40",
  },
  {
    key: "facebook" as const,
    labelKey: "facebook" as const,
    hrefKey: "facebook" as const,
    ring: "hover:ring-[#1877F2]/40",
  },
  {
    key: "whatsapp" as const,
    labelKey: "whatsapp" as const,
    hrefKey: "whatsapp" as const,
    ring: "hover:ring-[#25D366]/40",
  },
];

type Variant = "row" | "stack";

export default function SocialChatButtons({
  links,
  variant = "row",
}: {
  links: ChatChannelLinks;
  variant?: Variant;
}) {
  const t = useTranslations("chat");

  const items = CHANNELS.filter((c) => links[c.hrefKey]);

  if (items.length === 0) return null;

  const layout =
    variant === "row"
      ? "flex flex-wrap gap-3"
      : "flex flex-col gap-3";

  return (
    <div className={layout}>
      {items.map((channel) => (
        <a
          key={channel.key}
          href={links[channel.hrefKey]}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:border-orange-300 hover:shadow-md hover:ring-2 ${channel.ring}`}
        >
          <ChatChannelIcon channel={channel.key} className="h-8 w-8 shrink-0" />
          <span>{t(channel.labelKey)}</span>
        </a>
      ))}
    </div>
  );
}
