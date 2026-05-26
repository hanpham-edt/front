"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Product } from "@/types/product-types";
import { ProductService } from "@/services/api/productService";
import ProductCard from "./ProductCard";

const PER_PAGE = 4;

interface SimilarProductsSliderProps {
  productId: string;
  categoryId?: string | null;
}

export default function SimilarProductsSlider({
  productId,
  categoryId,
}: SimilarProductsSliderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setStartIndex(0);
  }, [products.length]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const excludeCurrent = (list: Product[]) =>
        list.filter((p) => p.id !== productId && p.isActive);

      let items: Product[] = [];

      if (categoryId) {
        const byCategory = await ProductService.getProducts({
          category: categoryId,
          isActive: true,
          limit: 16,
          page: 1,
        });
        items = excludeCurrent(byCategory?.data ?? []);
      }

      if (items.length === 0) {
        const fallback = await ProductService.getProducts({
          isActive: true,
          limit: 16,
          page: 1,
        });
        items = excludeCurrent(fallback?.data ?? []);
      }

      setProducts(items);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productId, categoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    if (products.length === 0) return [];
    const count = Math.min(PER_PAGE, products.length);
    return Array.from({ length: count }, (_, i) => {
      const idx = (startIndex + i) % products.length;
      return products[idx];
    });
  }, [products, startIndex]);

  const canSlide = products.length > PER_PAGE;

  const goPrev = () => {
    if (!canSlide) return;
    setStartIndex(
      (prev) => (prev - PER_PAGE + products.length) % products.length,
    );
  };

  const goNext = () => {
    if (!canSlide) return;
    setStartIndex((prev) => (prev + PER_PAGE) % products.length);
  };

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-100 bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Sản phẩm tương tự
        </h2>

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
              aria-label="Sản phẩm trước"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="grid min-w-0 flex-1 grid-cols-2 items-stretch gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-6">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!canSlide}
              className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-30"
              aria-label="Sản phẩm tiếp theo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
