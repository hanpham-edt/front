import { CartState } from "@/types/cart-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductVariant } from "@/types/product-types";
import { getCartLineKey, getEffectiveProductPrice } from "@/lib/cart-line";
import { getProductPrimaryImageUrl } from "@/lib/product-images";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function recalc(state: CartState) {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        variant?: ProductVariant | null;
      }>,
    ) => {
      const qty = Math.max(1, action.payload.quantity ?? 1);
      const primaryImage = getProductPrimaryImageUrl(action.payload.product);
      const product = primaryImage
        ? { ...action.payload.product, imageUrl: primaryImage }
        : action.payload.product;
      const variant = action.payload.variant ?? null;
      const lineKey = getCartLineKey(product.id, variant?.id);
      const unitPrice = getEffectiveProductPrice(product, variant);

      const existing = state.items.find((i) => i.lineKey === lineKey);
      if (existing) {
        existing.quantity += qty;
        existing.unitPrice = unitPrice;
        existing.product = product;
        existing.variant = variant;
      } else {
        state.items.push({
          lineKey,
          productId: product.id,
          variantId: variant?.id ?? null,
          variantName: variant?.name ?? null,
          product,
          variant,
          unitPrice,
          quantity: qty,
        });
      }
      recalc(state);
    },
    setQuantity: (
      state,
      action: PayloadAction<{ lineKey: string; quantity: number }>,
    ) => {
      const { lineKey, quantity } = action.payload;
      const item = state.items.find((i) => i.lineKey === lineKey);
      if (!item) return;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.lineKey !== lineKey);
      } else {
        item.quantity = quantity;
      }
      recalc(state);
    },
    removeFromCart: (state, action: PayloadAction<{ lineKey: string }>) => {
      state.items = state.items.filter(
        (i) => i.lineKey !== action.payload.lineKey,
      );
      recalc(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    patchCartProducts: (
      state,
      action: PayloadAction<
        Record<string, { imageUrl: string; imageUrls?: string[] }>
      >,
    ) => {
      for (const item of state.items) {
        const patch = action.payload[item.productId];
        if (!patch) continue;
        item.product = {
          ...item.product,
          imageUrl: patch.imageUrl,
          ...(patch.imageUrls ? { imageUrls: patch.imageUrls } : {}),
        };
      }
    },
  },
});
export const {
  addToCart,
  setQuantity,
  removeFromCart,
  clearCart,
  patchCartProducts,
} = cartSlice.actions;
export default cartSlice.reducer;
