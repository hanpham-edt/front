import { Product, ProductVariant } from "./product-types";

export interface CartItem {
  lineKey: string;
  productId: string;
  variantId: string | null;
  variantName: string | null;
  product: Product;
  variant: ProductVariant | null;
  unitPrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
