export const MAX_PRODUCT_IMAGES = 5;

export function remainingImageSlots(currentCount: number): number {
  return Math.max(0, MAX_PRODUCT_IMAGES - currentCount);
}

/** Ảnh đại diện: imageUrl → imageUrls → images[].url (từ API) */
export function getProductPrimaryImageUrl(product: {
  imageUrl?: string | null;
  imageUrls?: string[] | null;
  images?: Array<{ url?: string | null } | string> | null;
}): string {
  const direct = product.imageUrl?.trim();
  if (direct) return direct;

  for (const url of product.imageUrls ?? []) {
    const trimmed = url?.trim();
    if (trimmed) return trimmed;
  }

  for (const entry of product.images ?? []) {
    const url =
      typeof entry === "string" ? entry : entry?.url;
    const trimmed = url?.trim();
    if (trimmed) return trimmed;
  }

  return "";
}

export function isLocalProductImage(src: string): boolean {
  return src.startsWith("/images/");
}
