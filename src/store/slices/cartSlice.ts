import { CartState } from "@/types/cart-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {}, // for empty now
});
export const {} = cartSlice.actions;
export default cartSlice.reducer;
