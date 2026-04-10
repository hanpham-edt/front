export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string;
  isActive: boolean;
  category: string | null;
  categoryId: string;
  updatedAt: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
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
