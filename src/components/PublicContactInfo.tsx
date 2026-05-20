"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { usePublicSettings } from "@/hooks/usePublicSettings";

type Layout = "cards";

interface PublicContactInfoProps {
  layout: Layout;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export default function PublicContactInfo({ layout }: PublicContactInfoProps) {
  const { siteInfo } = usePublicSettings();

  if (layout !== "cards") {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
          <Phone className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Điện Thoại</h3>
        <a
          href={telHref(siteInfo.contactPhone)}
          className="text-gray-600 hover:text-orange-600"
        >
          {siteInfo.contactPhone}
        </a>
      </div>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Email</h3>
        <a
          href={`mailto:${siteInfo.contactEmail}`}
          className="text-gray-600 hover:text-orange-600"
        >
          {siteInfo.contactEmail}
        </a>
      </div>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Địa Chỉ</h3>
        <p className="whitespace-pre-line text-gray-600">{siteInfo.address}</p>
      </div>
    </div>
  );
}
