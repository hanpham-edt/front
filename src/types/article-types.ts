export interface ArticleTopicSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleTopic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleTopic {
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

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
  topicId: string | null;
  topic: ArticleTopicSummary | null;
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
  topicId?: string;
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
