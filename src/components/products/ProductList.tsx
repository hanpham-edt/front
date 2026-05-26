"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";

export default function ProductList() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") ?? "";
  const categoryFromUrl = searchParams.get("category") ?? "";
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl);
  const [page] = useState(1);
  const { products, getProducts } = useProducts();
  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchFromUrl), 400);
    return () => clearTimeout(timer);
  }, [searchFromUrl]);

  useEffect(() => {
    getProducts({
      page,
      limit,
      search: debouncedSearch,
      category: categoryFromUrl || undefined,
    });
  }, [getProducts, page, limit, debouncedSearch, categoryFromUrl]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản Phẩm Yến Sào
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những sản phẩm yến sào cao cấp được chọn lọc kỹ lưỡng, đảm
            bảo chất lượng và dinh dưỡng tốt nhất cho sức khỏe của bạn.
          </p>
          {debouncedSearch ? (
            <p className="mt-4 text-sm text-gray-500">
              Kết quả cho:{" "}
              <span className="font-medium text-orange-600">
                &quot;{debouncedSearch}&quot;
              </span>
            </p>
          ) : null}
        </div>

        {products.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            Không tìm thấy sản phẩm phù hợp.
          </p>
        ) : (
          <div className="grid grid-cols-2 items-stretch gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/products">
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
