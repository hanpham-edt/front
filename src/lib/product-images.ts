export const MAX_PRODUCT_IMAGES = 5;

export function remainingImageSlots(currentCount: number): number {
  return Math.max(0, MAX_PRODUCT_IMAGES - currentCount);
}
