import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import { CartItem } from "@/types/cart-types";
export function useCart() {
  const reduxCart = useSelector((state: IRootState) => state.cart);
  const items: CartItem[] = reduxCart.items;
  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: reduxCart.totalPrice,
  };
}
