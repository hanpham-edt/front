"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Product } from "@/types/product-types";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isInStock = product.stock > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image Container */}
      <div className="relative h-64 bg-gray-200">
        <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2 rounded-full transition-colors ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className="h-4 w-4" />
          </button>
          <Link href={`/products/${product.id}`}>
            <button className="p-2 bg-white rounded-full text-gray-600 hover:bg-orange-500 hover:text-white transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* Placeholder for image */}
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl.trimEnd()}
            alt={product.name}
            width={400}
            height={400}
            loading="lazy"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">{product.category}</div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-orange-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <span
            className={`text-sm ${
              isInStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {isInStock ? "✓ Còn hàng" : "✗ Hết hàng"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            disabled={!isInStock}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              product.stock
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Thêm vào giỏ
          </button>
          <Link href={`/products/${product.id}`}>
            <button className="py-2 px-4 border border-orange-500 text-orange-500 rounded-md text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
              Chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
