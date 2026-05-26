export function getCartLineKey(productId: string, variantId?: string | null): string {
  return `${productId}:${variantId ?? ""}`;
}

export function getEffectiveProductPrice(
  product: { price: number },
  variant?: { price: number } | null,
): number {
  return variant?.price ?? product.price;
}

export function getEffectiveStock(
  product: { stock: number },
  variants?: { stock: number; isActive: boolean }[],
  selectedVariant?: { stock: number } | null,
): number {
  if (variants && variants.length > 0) {
    return selectedVariant?.stock ?? 0;
  }
  return product.stock;
}

export function getActiveVariants(
  variants?: { isActive: boolean; stock: number }[] | null,
): { isActive: boolean; stock: number }[] {
  return (variants ?? []).filter((v) => v.isActive);
}

/** Có thể mua từ thẻ sản phẩm (danh sách / trang chủ) */
export function isProductPurchasable(product: {
  stock: number;
  variants?: { stock: number; isActive: boolean }[] | null;
}): boolean {
  const active = getActiveVariants(product.variants);
  if (active.length > 0) {
    return active.some((v) => v.stock > 0);
  }
  return product.stock > 0;
}

/** Cần vào trang chi tiết để chọn quy cách */
export function productRequiresVariantSelection(product: {
  variants?: { isActive: boolean; stock: number }[] | null;
}): boolean {
  return getActiveVariants(product.variants).length > 0;
}
