export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
  userName?: string;
  productName?: string;
}

export interface ProductReviewSummary {
  data: ProductReview[];
  averageRating: number;
  total: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}
