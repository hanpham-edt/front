"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Star, Trash2 } from "lucide-react";
import { reviewService } from "@/services/api/reviewService";
import type { ProductReview } from "@/types/review-types";

type Filter = "all" | "pending" | "approved";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const approved =
        filter === "approved" ? true : filter === "pending" ? false : undefined;
      setReviews(await reviewService.getAllAdmin(approved));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleApprove = async (id: string) => {
    await reviewService.approve(id);
    void load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa đánh giá này?")) return;
    await reviewService.remove(id);
    void load();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h1>
        <p className="text-gray-600">Duyệt đánh giá trước khi hiển thị công khai</p>
      </div>

      <div className="mb-4 flex gap-2">
        {(
          [
            { key: "pending" as const, label: "Chờ duyệt" },
            { key: "approved" as const, label: "Đã duyệt" },
            { key: "all" as const, label: "Tất cả" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filter === f.key
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="rounded-lg bg-white py-12 text-center text-gray-500 shadow">
            Không có đánh giá.
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-lg bg-white p-5 shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {r.productName ?? "Sản phẩm"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {r.userName} · {new Date(r.createdAt).toLocaleString("vi-VN")}
                  </p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {r.comment ? (
                    <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  {!r.isApproved ? (
                    <button
                      type="button"
                      onClick={() => void handleApprove(r.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Duyệt
                    </button>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Đã duyệt
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleDelete(r.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
