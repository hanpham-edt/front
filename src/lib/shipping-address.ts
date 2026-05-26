export interface ShippingContactInput {
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  shippingNote?: string;
}

export function formatShippingAddressText(
  input: ShippingContactInput,
): string {
  const lines = [
    `Người nhận: ${input.recipientName}`,
    `Điện thoại: ${input.recipientPhone}`,
    `Địa chỉ: ${input.recipientAddress}`,
  ];
  const note = input.shippingNote?.trim();
  if (note) lines.push(`Ghi chú: ${note}`);
  return lines.join("\n");
}

export function displayRecipientName(profile: {
  shippingRecipientName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): string {
  const saved = profile.shippingRecipientName?.trim();
  if (saved) return saved;
  return [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}
