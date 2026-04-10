"use client";
import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";

export default function ProductList() {
  // const featuredProducts = products.filter((product) => product.featured);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { products, isLoading, getProducts, meta } = useProducts();
  const limit = 12;

  useEffect(() => {
    getProducts({ page, limit, search: debouncedSearch });
  }, [getProducts, page, limit, debouncedSearch]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những sản phẩm yến sào cao cấp được chọn lọc kỹ lưỡng, đảm
            bảo chất lượng và dinh dưỡng tốt nhất cho sức khỏe của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Xem Tất Cả Sản Phẩm
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
