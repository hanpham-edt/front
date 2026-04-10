export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategory {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface CategoryResponse {
  data: Category[];
  meta: PaginationMeta;
}
