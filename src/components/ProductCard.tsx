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
        {/* <div className="absolute top-2 left-2 z-10">
          {product.featured && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Nổi Bật
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
              -
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100,
              )}
              %
            </span>
          )}
        </div> */}

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

        <Image
          src={product.imageUrl.trimEnd()}
          alt={product.name}
          width={400}
          height={400}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          {product.category}
          {/* <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              product.category === "premium"
                ? "bg-yellow-100 text-yellow-800"
                : product.category === "standard"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {product.category === "premium"
              ? "Cao Cấp"
              : product.category === "standard"
                ? "Tiêu Chuẩn"
                : "Kinh Tế"}
          </span> */}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        {/* <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.reviews})
          </span>
        </div> */}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-orange-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Weight and Origin */}
        {/* <div className="text-sm text-gray-600 mb-3">
          <p>Trọng lượng: {product.weight}</p>
          <p>Xuất xứ: {product.origin}</p>
        </div> */}

        {/* Stock Status */}
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
        {/* <div className="flex space-x-2">
          <button
            disabled={!product.inStock}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              product.inStock
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Thêm vào giỏ
          </button>
          <Link href={`/products/${product.id}`}>
            <button className="py-2 px-4 border border-orange-500 text-orange-500 rounded-md text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors">
              Chi tiết
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
