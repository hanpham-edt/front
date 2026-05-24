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
