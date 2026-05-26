export interface Users {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  shippingAddress?: string | null;
  shippingRecipientName?: string | null;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}
export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  shippingAddress?: string;
  shippingRecipientName?: string;
  role?: "USER" | "STAFF" | "ADMIN";
  isActive?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  role?: "USER" | "STAFF" | "ADMIN";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserResponse {
  data: Users[];
  meta: PaginationMeta;
}
