"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { useState } from "react";
import {
  getProductPrimaryImageUrl,
  isLocalProductImage,
} from "@/lib/product-images";

type ProductThumbnailProps = {
  name: string;
  imageUrl?: string | null;
  imageUrls?: string[] | null;
  images?: Array<{ url?: string | null } | string> | null;
  size?: "sm" | "md";
  className?: string;
};

const SIZE = {
  sm: { box: "h-14 w-14", sizes: "56px", icon: "h-5 w-5" },
  md: { box: "h-24 w-24", sizes: "96px", icon: "h-7 w-7" },
} as const;

export default function ProductThumbnail({
  name,
  imageUrl,
  imageUrls,
  images,
  size = "md",
  className = "",
}: ProductThumbnailProps) {
  const src = getProductPrimaryImageUrl({ imageUrl, imageUrls, images });
  const [failed, setFailed] = useState(false);
  const dim = SIZE[size];

  if (!src || failed) {
    return (
      <div
        className={`flex ${dim.box} shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gradient-to-br from-yellow-50 to-orange-50 text-gray-400 ${className}`}
        aria-hidden
      >
        <Package className={dim.icon} />
      </div>
    );
  }

  return (
    <div
      className={`relative ${dim.box} shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white ${className}`}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes={dim.sizes}
        className="object-contain p-1"
        unoptimized={isLocalProductImage(src)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
