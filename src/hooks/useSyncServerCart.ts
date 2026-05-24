"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { IRootState } from "@/store";
import { cartService } from "@/services/api/cartService";

/** Đồng bộ giỏ Redux lên server khi khách đã đăng nhập (phục vụ giỏ bỏ quên). */
export function useSyncServerCart() {
  const items = useSelector((s: IRootState) => s.cart.items);
  const accessToken = useSelector((s: IRootState) => s.auth.accessToken);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const payload = items.map((row) => ({
        productId: row.productId,
        quantity: row.quantity,
        ...(row.variantId ? { variantId: row.variantId } : {}),
      }));

      void cartService.syncCart(payload).catch(() => {
        // Không chặn UX nếu sync thất bại
      });
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [items, accessToken]);
}
