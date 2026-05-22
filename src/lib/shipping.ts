export interface ShippingConfig {
  shippingFee: number;
  freeShippingThreshold: number;
}

export function calcShippingFee(
  subtotal: number,
  itemCount: number,
  config: ShippingConfig,
): number {
  if (itemCount <= 0) return 0;
  if (subtotal >= config.freeShippingThreshold) return 0;
  return config.shippingFee;
}
