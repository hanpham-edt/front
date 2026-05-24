export const MEDIA_FOLDERS = {
  PRODUCTS: "products",
  HERO: "hero",
  NEWS: "news",
  CONTENT: "content",
  GENERAL: "general",
} as const;

export type MediaFolder =
  (typeof MEDIA_FOLDERS)[keyof typeof MEDIA_FOLDERS];

export const MEDIA_FOLDER_LIST: MediaFolder[] = [
  MEDIA_FOLDERS.PRODUCTS,
  MEDIA_FOLDERS.HERO,
  MEDIA_FOLDERS.NEWS,
  MEDIA_FOLDERS.CONTENT,
  MEDIA_FOLDERS.GENERAL,
];

export const MEDIA_FOLDER_LABELS: Record<MediaFolder, string> = {
  [MEDIA_FOLDERS.PRODUCTS]: "Sản phẩm",
  [MEDIA_FOLDERS.HERO]: "Hero banner",
  [MEDIA_FOLDERS.NEWS]: "Tin tức",
  [MEDIA_FOLDERS.CONTENT]: "Nội dung (editor)",
  [MEDIA_FOLDERS.GENERAL]: "Khác",
};
