export interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  product: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalReviews: number;
}

export interface NewReview {
  name: string;
  email: string;
  rating: number;
  comment: string;
}
