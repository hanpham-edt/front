"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Loader2,
  Search,
  Upload,
  X,
} from "lucide-react";
import {
  MEDIA_FOLDER_LABELS,
  type MediaFolder,
} from "@/lib/media-folders";
import MediaFolderTabs from "@/components/admin/MediaFolderTabs";
import { mediaService, type MediaAsset } from "@/services/api/mediaService";

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** Thư mục mặc định khi mở picker */
  folder: MediaFolder;
  /** Chỉ hiển thị / upload trong thư mục này */
  lockFolder?: boolean;
  title?: string;
}

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
  folder,
  lockFolder = true,
  title,
}: MediaPickerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeFolder, setActiveFolder] = useState<MediaFolder | "all">(folder);
  const [folderCounts, setFolderCounts] = useState<
    Awaited<ReturnType<typeof mediaService.getFolders>>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const effectiveFolder: MediaFolder | undefined = lockFolder
    ? folder
    : activeFolder === "all"
      ? undefined
      : activeFolder;

  const load = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    setError(null);
    try {
      const [res, folders] = await Promise.all([
        mediaService.getAll({
          page,
          limit: 24,
          search: debouncedSearch || undefined,
          folder: effectiveFolder,
        }),
        mediaService.getFolders(),
      ]);
      setItems(res.data);
      setFolderCounts(folders);
    } catch {
      setItems([]);
      setError("Không tải được thư viện.");
    } finally {
      setLoading(false);
    }
  }, [open, page, debouncedSearch, effectiveFolder]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setDebouncedSearch("");
      setPage(1);
      setError(null);
      setActiveFolder(folder);
    }
  }, [open, folder]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const file = files[0];
      const targetFolder = lockFolder ? folder : (effectiveFolder ?? folder);
      const { url } = await mediaService.upload(file, targetFolder);
      onSelect(url);
      onClose();
    } catch {
      setError("Upload thất bại (tối đa 5MB, JPG/PNG/WEBP/GIF).");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!open) return null;

  const modalTitle =
    title ??
    `Chọn ảnh — ${MEDIA_FOLDER_LABELS[lockFolder ? folder : (effectiveFolder ?? folder)]}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">{modalTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!lockFolder ? (
          <div className="border-b px-4 py-3">
            <MediaFolderTabs
              active={activeFolder}
              onChange={(f) => {
                setActiveFolder(f);
                setPage(1);
              }}
              counts={folderCounts}
            />
          </div>
        ) : (
          <p className="border-b px-4 py-2 text-xs text-gray-500">
            Thư mục: <strong>{MEDIA_FOLDER_LABELS[folder]}</strong>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Tìm file..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-3 text-sm"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Tải mới
          </button>
        </div>

        {error && (
          <p className="px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Chưa có ảnh trong thư mục này. Tải ảnh mới hoặc chọn thư mục khác.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelect(asset.url);
                    onClose();
                  }}
                  className="group overflow-hidden rounded-lg border border-gray-200 text-left hover:border-amber-500 hover:ring-2 hover:ring-amber-200"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.filename}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute right-1 top-1 rounded bg-amber-600 p-0.5 text-white opacity-0 group-hover:opacity-100">
                      <Check className="h-3 w-3" />
                    </span>
                  </div>
                  <p className="truncate p-1 text-xs text-gray-600">
                    {asset.filename}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
