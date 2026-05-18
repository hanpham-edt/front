export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  content: string;
  status: boolean;
}

export interface CreateContact {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  content: string;
  status: boolean;
}

export interface UpdateContact {
  status: boolean;
}
export interface ContactQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface ContactResponse {
  data: Contact[];
  meta: PaginationMeta;
}
