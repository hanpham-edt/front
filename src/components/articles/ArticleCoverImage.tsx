"use client";

import Image from "next/image";
import { useState } from "react";
import { Newspaper } from "lucide-react";
import {
  isLocalStoredImage,
  resolveStoredImageUrl,
} from "@/lib/image-url";

type ArticleCoverImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function ArticleCoverImage({
  src,
  alt,
  sizes,
  className = "relative aspect-[16/10] bg-gray-100",
  imageClassName = "object-cover transition duration-300 group-hover:scale-105",
  priority = false,
}: ArticleCoverImageProps) {
  const resolved = resolveStoredImageUrl(src);
  const [failed, setFailed] = useState(false);

  if (!resolved || failed) {
    return (
      <div
        className={`flex items-center justify-center text-gray-400 ${className}`}
      >
        <Newspaper className="h-10 w-10 opacity-40" aria-hidden />
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={sizes}
        className={imageClassName}
        priority={priority}
        unoptimized={isLocalStoredImage(resolved)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
