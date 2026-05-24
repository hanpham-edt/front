export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticle {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  publishedAt?: string;
}

export interface ArticleListResponse {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
