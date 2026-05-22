"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { reviewService } from "@/services/api/reviewService";
import type { ProductReviewSummary } from "@/types/review-types";

type Props = {
  productId: string;
  productName: string;
};

export default function ProductReviews({ productId, productName }: Props) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ProductReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSummary(await reviewService.getByProduct(productId));
    } catch {
      setSummary({ data: [], averageRating: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setMessage(null);
    try {
      await reviewService.create({
        productId,
        rating,
        comment: comment.trim() || undefined,
      });
      setComment("");
      setMessage(
        "Cảm ơn bạn! Đánh giá đã gửi và sẽ hiển thị sau khi admin duyệt.",
      );
    } catch {
      setMessage("Không gửi được đánh giá. Có thể bạn đã đánh giá sản phẩm này.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-xl font-bold text-gray-900">Đánh giá khách hàng</h2>
      {loading ? (
        <div className="mt-4 flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(summary?.averageRating ?? 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {summary?.averageRating ?? 0}/5 · {summary?.total ?? 0} đánh giá
            </span>
          </div>

          {user ? (
            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <p className="mb-2 text-sm font-medium text-gray-700">
                Đánh giá {productName}
              </p>
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="p-0.5"
                    aria-label={`${n} sao`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        n <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn (tùy chọn)"
                className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              {message ? (
                <p className="mb-2 text-sm text-green-700">{message}</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-gray-600">
              <Link href="/login" className="text-orange-600 hover:underline">
                Đăng nhập
              </Link>{" "}
              để đánh giá sản phẩm.
            </p>
          )}

          <ul className="mt-8 space-y-4">
            {summary?.data.length ? (
              summary.data.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-gray-100 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {r.userName ?? "Khách hàng"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="mt-1 flex">
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
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">Chưa có đánh giá nào.</li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}
