import { Product } from "./product-types";
export interface ProductTest {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "premium" | "standard" | "economy";
  weight: string;
  origin: string;
  benefits: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  shippingAddress: string;
  paymentMethod: string;
}
