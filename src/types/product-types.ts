export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string;
  imageUrls?: string[];
  isActive: boolean;
  category: string | null;
  categoryId: string;
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  variants?: ProductVariant[];
  updatedAt: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string;
  imageUrls?: string[];
  categoryId: string;
  isActive: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  variants?: Array<{
    id?: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    sortOrder?: number;
    isActive?: boolean;
  }>;
}
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
}
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface ProductResponse {
  data: Product[];
  meta: PaginationMeta;
}
