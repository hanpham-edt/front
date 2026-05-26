import type { PublicSiteInfo } from "@/types/settings-types";

export interface ChatChannelLinks {
  zalo: string;
  facebook: string;
  whatsapp: string;
}

/** Chuẩn hóa SĐT VN thành dạng 84xxxxxxxxx (không dấu +). */
export function normalizeVietnamPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("84")) return digits;
  if (digits.startsWith("0")) return `84${digits.slice(1)}`;
  return digits;
}

export function resolveChatLinks(siteInfo: PublicSiteInfo): ChatChannelLinks {
  const phone = normalizeVietnamPhone(siteInfo.contactPhone);

  const zalo =
    siteInfo.zaloUrl.trim() ||
    (phone ? `https://zalo.me/${phone}` : "");

  const whatsapp =
    siteInfo.whatsappUrl.trim() ||
    (phone ? `https://wa.me/${phone}` : "");

  const facebook = siteInfo.facebookUrl.trim();

  return { zalo, facebook, whatsapp };
}

export function hasAnyChatLink(links: ChatChannelLinks): boolean {
  return Boolean(links.zalo || links.facebook || links.whatsapp);
}
