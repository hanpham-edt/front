export interface Hero {
  id: number;
  title: string;
  subtitle: string;
  description: string | null;
  imageUrl: string;
  ctaLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHero {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
  ctaLink: string;
}

export type UpdateHero = Partial<CreateHero>;
