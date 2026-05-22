export interface Hero {
  id: number;
  title: string;
  subtitle: string;
  description: string | null;
  imageUrl: string;
  ctaLink: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHero {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
  ctaLink: string;
  isPublished?: boolean;
  publishedAt?: string;
}

export type UpdateHero = Partial<CreateHero>;

export interface HeroListResponse {
  data: Hero[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
