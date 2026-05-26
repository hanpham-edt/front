"use client";

import { useCallback, useRef, useState } from "react";
import {
  X,
  Upload,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  SkipForward,
} from "lucide-react";
import axios from "axios";
import { ProductService } from "@/services/api/productService";
import type { ProductImportResult } from "@/types/product-types";
import { countCsvDataRows, parseCsv } from "@/lib/parse-csv";

type Props = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

export default function ProductCsvImportModal({
  open,
  onClose,
  onImported,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [downloading, setDownloading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductImportResult | null>(null);

  const resetFile = useCallback(() => {
    setCsvText("");
    setFileName("");
    setRowCount(0);
    setPreviewHeaders([]);
    setPreviewRows([]);
    setError(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const handleClose = () => {
    resetFile();
    onClose();
  };

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const blob = await ProductService.downloadImportTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mau-import-san-pham.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Không tải được file mẫu. Vui lòng thử lại.");
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Vui lòng chọn file .csv");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const rows = parseCsv(text);
      const dataRows = countCsvDataRows(text);

      if (dataRows === 0) {
        setError("File CSV cần dòng tiêu đề và ít nhất một dòng dữ liệu.");
        return;
      }
      if (dataRows > 200) {
        setError("Mỗi lần import tối đa 200 sản phẩm.");
        return;
      }

      setCsvText(text);
      setFileName(file.name);
      setRowCount(dataRows);
      setPreviewHeaders(rows[0] ?? []);
      setPreviewRows(rows.slice(1, 6));
      setError(null);
      setResult(null);
    };
    reader.onerror = () => setError("Không đọc được file.");
    reader.readAsText(file, "UTF-8");
  };

  const handleImport = async () => {
    if (!csvText.trim()) {
      setError("Chọn file CSV trước khi import.");
      return;
    }

    setImporting(true);
    setError(null);
    try {
      const res = await ProductService.importFromCsv(csvText, {
        skipDuplicates: true,
      });
      setResult(res);
      if (res.created > 0) {
        onImported();
      }
    } catch (e: unknown) {
      let msg = "Import thất bại. Vui lòng kiểm tra file và thử lại.";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as
          | { message?: string | string[] }
          | undefined;
        const m = data?.message;
        if (typeof m === "string") msg = m;
        else if (Array.isArray(m)) msg = m.join(", ");
      }
      setError(msg);
    } finally {
      setImporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Import sản phẩm từ CSV
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-md border border-orange-100 bg-orange-50 p-4 text-sm text-gray-700">
            <p className="font-medium text-gray-900">Cột bắt buộc</p>
            <p className="mt-1">
              <code className="text-xs">name</code>, <code className="text-xs">sku</code>,{" "}
              <code className="text-xs">price</code>, và một trong{" "}
              <code className="text-xs">categoryId</code> /{" "}
              <code className="text-xs">categorySlug</code> (hoặc{" "}
              <code className="text-xs">danh_muc</code>).
            </p>
            <p className="mt-2 text-gray-600">
              Tùy chọn: stock, description, imageUrl, slug, metaTitle,
              metaDescription, isActive. SKU trùng trong DB sẽ được bỏ qua.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleDownloadTemplate()}
              disabled={downloading}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Tải file mẫu
            </button>
            <label className="inline-flex cursor-pointer items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              <Upload className="mr-2 h-4 w-4" />
              Chọn file CSV
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {fileName ? (
            <p className="text-sm text-gray-600">
              Đã chọn: <span className="font-medium">{fileName}</span> —{" "}
              {rowCount} dòng dữ liệu
            </p>
          ) : null}

          {previewHeaders.length > 0 && previewRows.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <p className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
                Xem trước (tối đa 5 dòng)
              </p>
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {previewHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-medium text-gray-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewRows.map((row, idx) => (
                    <tr key={idx}>
                      {previewHeaders.map((_, colIdx) => (
                        <td
                          key={colIdx}
                          className="max-w-[140px] truncate px-3 py-2 text-gray-800"
                          title={row[colIdx]}
                        >
                          {row[colIdx] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {result ? (
            <div className="space-y-3 rounded-md border border-gray-200 p-4">
              <p className="font-medium text-gray-900">Kết quả import</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center text-green-700">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Tạo mới: {result.created}
                </span>
                <span className="flex items-center text-amber-700">
                  <SkipForward className="mr-1 h-4 w-4" />
                  Bỏ qua: {result.skipped}
                </span>
                <span className="flex items-center text-red-700">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  Lỗi: {result.failed}
                </span>
              </div>
              {result.results.some((r) => r.status !== "created") ? (
                <ul className="max-h-40 overflow-y-auto text-xs text-gray-600">
                  {result.results
                    .filter((r) => r.status !== "created")
                    .map((r) => (
                      <li key={r.row} className="border-t border-gray-100 py-1">
                        Dòng {r.row}
                        {r.sku ? ` (${r.sku})` : ""}: {r.message ?? r.status}
                      </li>
                    ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {result ? "Đóng" : "Hủy"}
          </button>
          {!result ? (
            <button
              type="button"
              onClick={() => void handleImport()}
              disabled={importing || !csvText}
              className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Import {rowCount > 0 ? `(${rowCount})` : ""}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
