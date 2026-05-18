import { uploadService } from "@/services/api/uploadService";

export function isStoredImageUrl(url: string): boolean {
  const trimmed = url.trim();
  return (
    trimmed.startsWith("/images/") || /^https?:\/\//i.test(trimmed)
  );
}

export async function uploadProductImageFile(file: File): Promise<string> {
  const { url } = await uploadService.uploadProductImage(file);
  return url;
}
