"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Loader2,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import MediaFolderTabs from "@/components/admin/MediaFolderTabs";
import {
  MEDIA_FOLDERS,
  MEDIA_FOLDER_LABELS,
  MEDIA_FOLDER_LIST,
  type MediaFolder,
} from "@/lib/media-folders";
import {
  mediaService,
  type MediaAsset,
  type MediaFolderSummary,
} from "@/services/api/mediaService";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function uploaderLabel(asset: MediaAsset) {
  const u = asset.uploadedBy;
  if (!u) return "—";
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
  return name || u.email;
}

export default function AdminMediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 24,
    totalPages: 1,
  });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<MediaFolder | "all">("all");
  const [folderCounts, setFolderCounts] = useState<MediaFolderSummary[]>([]);
  const [uploadFolder, setUploadFolder] = useState<MediaFolder>(
    MEDIA_FOLDERS.GENERAL,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, folders] = await Promise.all([
        mediaService.getAll({
          page,
          limit,
          search: debouncedSearch || undefined,
          folder: activeFolder === "all" ? undefined : activeFolder,
        }),
        mediaService.getFolders(),
      ]);
      setItems(res.data);
      setMeta(res.meta);
      setFolderCounts(folders);
    } catch {
      setItems([]);
      setError("Không tải được thư viện media.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, activeFolder]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!copiedUrl) return;
    const t = setTimeout(() => setCopiedUrl(null), 2000);
    return () => clearTimeout(t);
  }, [copiedUrl]);

  const resolveUploadFolder = (): MediaFolder =>
    activeFolder !== "all" ? activeFolder : uploadFolder;

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const targetFolder = resolveUploadFolder();
    setUploading(true);
    setMessage(null);
    setError(null);
    let ok = 0;
    try {
      for (const file of Array.from(files)) {
        await mediaService.upload(file, targetFolder);
        ok += 1;
      }
      setMessage(
        `Đã tải lên ${ok} ảnh vào thư mục «${MEDIA_FOLDER_LABELS[targetFolder]}».`,
      );
      setPage(1);
      void load();
    } catch {
      setError(
        ok > 0
          ? `Đã tải ${ok} ảnh; một số file lỗi (tối đa 5MB, JPG/PNG/WEBP/GIF).`
          : "Upload thất bại. Kiểm tra định dạng và dung lượng.",
      );
      if (ok > 0) void load();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
    } catch {
      setError("Không copy được URL.");
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (
      !confirm(
        `Xóa "${asset.filename}"? File trên server cũng sẽ bị xóa. Ảnh đang dùng trên sản phẩm/tin có thể bị hỏng.`,
      )
    ) {
      return;
    }
    setDeletingId(asset.id);
    setMessage(null);
    setError(null);
    try {
      await mediaService.remove(asset.id);
      setMessage("Đã xóa file.");
      void load();
    } catch {
      setError("Không xóa được file.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thư viện media</h1>
          <p className="text-gray-600">
            Ảnh được phân thư mục: sản phẩm, hero, tin tức, nội dung editor, khác.
            Lưu tại <code className="text-sm">/images/&#123;thư-mục&#125;/</code>.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          {activeFolder !== "all" ? (
            <p className="text-sm text-gray-600">
              Upload vào:{" "}
              <strong>{MEDIA_FOLDER_LABELS[activeFolder]}</strong>
            </p>
          ) : (
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value as MediaFolder)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              aria-label="Thư mục upload"
            >
              {MEDIA_FOLDER_LIST.map((key) => (
                <option key={key} value={key}>
                  Upload vào: {MEDIA_FOLDER_LABELS[key]}
                </option>
              ))}
            </select>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Tải ảnh lên
          </button>
        </div>
      </div>

      {message && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mb-4">
        <MediaFolderTabs
          active={activeFolder}
          onChange={(f) => {
            setActiveFolder(f);
            setPage(1);
            if (f !== "all") setUploadFolder(f);
          }}
          counts={folderCounts}
        />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm theo tên file..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <p className="text-sm text-gray-500">{meta.total} file</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-gray-500">
          Chưa có ảnh trong thư viện. Hãy tải lên hoặc upload từ form sản phẩm.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((asset) => (
            <div
              key={asset.id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.alt ?? asset.filename}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-center gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    title="Copy URL"
                    onClick={() => void copyUrl(asset.url)}
                    className="rounded bg-white/90 p-1.5 text-gray-800 hover:bg-white"
                  >
                    {copiedUrl === asset.url ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    title="Xóa"
                    disabled={deletingId === asset.id}
                    onClick={() => void handleDelete(asset)}
                    className="rounded bg-white/90 p-1.5 text-red-600 hover:bg-white disabled:opacity-50"
                  >
                    {deletingId === asset.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-0.5 p-2">
                <p
                  className="truncate text-xs font-medium text-gray-900"
                  title={asset.filename}
                >
                  {asset.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {MEDIA_FOLDER_LABELS[asset.folder as MediaFolder] ??
                    asset.folder}{" "}
                  · {formatBytes(asset.sizeBytes)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(asset.createdAt)}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {uploaderLabel(asset)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && meta.totalPages > 1 && (
        <div className="mt-8">
          <AdminPagination
            page={page}
            total={meta.total}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            limit={limit}
            onLimitChange={(v) => {
              setLimit(v);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
