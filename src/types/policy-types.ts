export interface PolicyPage {
  id?: string;
  slug: string;
  title: string;
  content: string;
  isPublished?: boolean;
  sortOrder?: number;
  updatedAt?: string;
}

export interface CreatePolicyPage {
  title: string;
  slug?: string;
  content: string;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdatePolicyPage {
  title?: string;
  slug?: string;
  content?: string;
  isPublished?: boolean;
  sortOrder?: number;
}
