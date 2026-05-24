"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { IRootState } from "@/store";
import { useAppDispatch } from "@/store";
import { patchCartProducts } from "@/store/slices/cartSlice";
import { getProductPrimaryImageUrl } from "@/lib/product-images";
import { ProductService } from "@/services/api/productService";

/** Bổ sung ảnh cho sản phẩm trong giỏ (localStorage cũ có thể thiếu imageUrl). */
export function useRefreshCartProductImages() {
  const dispatch = useAppDispatch();
  const items = useSelector((s: IRootState) => s.cart.items);
  const fetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const missingIds = [
      ...new Set(
        items
          .filter((row) => !getProductPrimaryImageUrl(row.product))
          .map((row) => row.productId),
      ),
    ].filter((id) => !fetchedRef.current.has(id));

    if (missingIds.length === 0) return;

    let cancelled = false;

    void (async () => {
      const patches: Record<
        string,
        { imageUrl: string; imageUrls?: string[] }
      > = {};

      await Promise.all(
        missingIds.map(async (productId) => {
          fetchedRef.current.add(productId);
          try {
            const product = await ProductService.getProductById(productId);
            const imageUrl = getProductPrimaryImageUrl(product);
            if (!imageUrl) return;
            patches[productId] = {
              imageUrl,
              imageUrls: product.imageUrls,
            };
          } catch {
            fetchedRef.current.delete(productId);
          }
        }),
      );

      if (!cancelled && Object.keys(patches).length > 0) {
        dispatch(patchCartProducts(patches));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items, dispatch]);
}
