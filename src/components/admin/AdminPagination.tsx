"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  /** Hiển thị chọn số dòng / trang */
  limitOptions?: number[];
  onLimitChange?: (limit: number) => void;
};

function getVisiblePages(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 1) return total === 1 ? [1] : [];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = sorted[i - 1];
    if (i > 0 && prev !== undefined && p - prev > 1) {
      result.push("ellipsis");
    }
    result.push(p);
  }
  return result;
}

export default function AdminPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  limitOptions = [10, 12, 20, 50],
  onLimitChange,
}: AdminPaginationProps) {
  if (total === 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const visiblePages = getVisiblePages(page, safeTotalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Hiển thị{" "}
        <span className="font-medium text-gray-900">
          {from}–{to}
        </span>{" "}
        trong tổng{" "}
        <span className="font-medium text-gray-900">{total}</span> mục
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {onLimitChange ? (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <span>Số dòng:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {limitOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <nav
          className="flex items-center gap-1"
          aria-label="Phân trang"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {visiblePages.map((item, idx) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-sm text-gray-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  className={`min-w-[2.25rem] rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                    item === page
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label={`Trang ${item}`}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <span className="px-2 text-sm text-gray-600 sm:hidden">
            {page}/{safeTotalPages}
          </span>

          <button
            type="button"
            disabled={page >= safeTotalPages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Trang sau"
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
