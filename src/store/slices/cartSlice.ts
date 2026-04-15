import { CartState } from "@/types/cart-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product-types";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function recalc(state: CartState) {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>,
    ) => {
      const qty = Math.max(1, action.payload.quantity ?? 1);
      const product = action.payload.product;
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity += qty;
        existing.product = product;
      } else {
        state.items.push({ productId: product.id, product, quantity: qty });
      }
      recalc(state);
    },
    setQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        item.quantity = quantity;
      }
      recalc(state);
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload.productId);
      recalc(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});
export const { addToCart, setQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
