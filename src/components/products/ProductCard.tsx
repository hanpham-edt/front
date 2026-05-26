"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Eye, Check } from "lucide-react";
import { Product } from "@/types/product-types";
import Image from "next/image";
import {
  getProductPrimaryImageUrl,
  isLocalProductImage,
} from "@/lib/product-images";
import {
  isProductPurchasable,
  productRequiresVariantSelection,
} from "@/lib/cart-line";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const isInStock = isProductPurchasable(product);
  const needsVariant = productRequiresVariantSelection(product);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const imageSrc = getProductPrimaryImageUrl(product);
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(imageSrc) && !imageError;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) return;

    if (needsVariant) {
      router.push(`/products/${product.id}`);
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-100 transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gray-100">
        <Link
          href={`/products/${product.id}`}
          className="absolute inset-0 block"
          aria-label={product.name}
        >
          {showImage ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={isLocalProductImage(imageSrc)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-sm font-medium text-gray-500">
              Chưa có ảnh
            </div>
          )}
        </Link>

        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`rounded-full p-2 shadow-md transition-colors ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/95 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
            aria-label="Yêu thích"
          >
            <Heart className="h-4 w-4" />
          </button>
          <Link href={`/products/${product.id}`}>
            <button
              type="button"
              className="rounded-full bg-white/95 p-2 text-gray-600 shadow-md transition-colors hover:bg-orange-500 hover:text-white"
              aria-label="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {!isInStock && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            Hết hàng
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`} className="mb-2 block">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 transition-colors hover:text-orange-600 md:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mb-2 text-lg font-bold text-orange-600">
          {formatPrice(product.price)}
        </p>
        <p
          className={`mb-3 text-sm font-medium ${
            isInStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {isInStock ? "✓ Còn hàng" : "✗ Hết hàng"}
        </p>

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            disabled={!isInStock}
            onClick={handleAddToCart}
            className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
              !isInStock
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : added
                  ? "cursor-pointer bg-green-600 text-white"
                  : "cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4 shrink-0" />
                Đã thêm
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 shrink-0" />
                {needsVariant ? "Chọn quy cách" : "Thêm vào giỏ"}
              </>
            )}
          </button>
          <Link href={`/products/${product.id}`} className="shrink-0">
            <button
              type="button"
              className="whitespace-nowrap rounded-lg border border-orange-500 px-3 py-2.5 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-500 hover:text-white sm:px-4 sm:text-sm"
            >
              Chi tiết
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}
