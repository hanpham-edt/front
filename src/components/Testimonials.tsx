"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { reviewService } from "@/services/api/reviewService";
import type { ProductReview } from "@/types/review-types";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "K";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function ReviewCard({ review }: { review: ProductReview }) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const quote =
    review.comment?.trim() || t("defaultReviewQuote");

  return (
    <div className="h-full bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < review.rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-600 mb-4 line-clamp-4">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">
            {initials(review.userName ?? "K")}
          </span>
        </div>
        <div className="ml-3 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {review.userName ?? tCommon("customer")}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {review.productName ?? tCommon("product")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations("home");
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setPerPage(mq.matches ? 3 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [perPage]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReviews(await reviewService.getLatestApproved(9));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    if (reviews.length === 0) return [];
    const count = Math.min(perPage, reviews.length);
    return Array.from({ length: count }, (_, i) => {
      const idx = (startIndex + i) % reviews.length;
      return reviews[idx];
    });
  }, [reviews, startIndex, perPage]);

  const canSlide = reviews.length > perPage;

  const goPrev = () => {
    if (!canSlide) return;
    setStartIndex(
      (prev) => (prev - perPage + reviews.length) % reviews.length,
    );
  };

  const goNext = () => {
    if (!canSlide) return;
    setStartIndex((prev) => (prev + perPage) % reviews.length);
  };

  if (!loading && reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("testimonialsTitle")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("testimonialsSubtitle")}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="flex items-stretch gap-2 sm:gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canSlide}
              className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-30"
              aria-label={t("reviewPrev")}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {visible.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!canSlide}
              className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-30"
              aria-label={t("reviewNext")}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
