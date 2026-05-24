import type { MediaFolder } from "@/lib/media-folders";
import { MEDIA_FOLDERS } from "@/lib/media-folders";
import { uploadService } from "@/services/api/uploadService";

export function isStoredImageUrl(url: string): boolean {
  const trimmed = url.trim();
  return (
    trimmed.startsWith("/images/") || /^https?:\/\//i.test(trimmed)
  );
}

export async function uploadProductImageFile(
  file: File,
  folder: MediaFolder = MEDIA_FOLDERS.GENERAL,
): Promise<string> {
  const { url } = await uploadService.uploadProductImage(file, folder);
  return url;
}
