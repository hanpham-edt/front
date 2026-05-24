"use client";

import {
  MEDIA_FOLDER_LABELS,
  MEDIA_FOLDER_LIST,
  type MediaFolder,
} from "@/lib/media-folders";
import type { MediaFolderSummary } from "@/services/api/mediaService";

type MediaFolderTabsProps = {
  active: MediaFolder | "all";
  onChange: (folder: MediaFolder | "all") => void;
  counts?: MediaFolderSummary[];
  className?: string;
};

export default function MediaFolderTabs({
  active,
  onChange,
  counts,
  className = "",
}: MediaFolderTabsProps) {
  const countMap = new Map(
    counts?.map((c) => [c.folder, c.count]) ?? [],
  );
  const total = counts?.reduce((sum, c) => sum + c.count, 0) ?? 0;

  const items: Array<{ key: MediaFolder | "all"; label: string; count: number }> =
    [
      { key: "all", label: "Tất cả", count: total },
      ...MEDIA_FOLDER_LIST.map((folder) => ({
        key: folder,
        label: MEDIA_FOLDER_LABELS[folder],
        count: countMap.get(folder) ?? 0,
      })),
    ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            active === item.key
              ? "bg-amber-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {item.label}
          <span
            className={`ml-1.5 text-xs ${
              active === item.key ? "text-amber-100" : "text-gray-500"
            }`}
          >
            ({item.count})
          </span>
        </button>
      ))}
    </div>
  );
}
