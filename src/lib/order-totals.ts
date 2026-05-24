export function calcVatAmount(
  taxableAmount: number,
  vatEnabled: boolean,
  vatRate: number,
): number {
  if (!vatEnabled || taxableAmount <= 0) return 0;
  return Math.round((taxableAmount * vatRate) / 100);
}
