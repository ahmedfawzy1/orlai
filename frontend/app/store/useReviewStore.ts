import { create } from 'zustand';
import { Review, NewReview } from '../types/review';
import {
  getProductReviews,
  getAllReviews,
  createReview,
  checkCanReview,
} from '../lib/reviews';

interface ReviewStatus {
  canReview: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
  message: string;
}

interface ReviewStore {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  isLoading: boolean;
  error: string | null;
  reviewStatus: ReviewStatus | null;
  setReviews: (reviews: Review[]) => void;
  getProductReviews: (
    productId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  getAllReviews: (
    page?: number,
    limit?: number,
    sort?: string
  ) => Promise<void>;
  createReview: (productId: string, reviewData: NewReview) => Promise<void>;
  checkCanReview: (productId: string) => Promise<void>;
  clearError: () => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  currentPage: 1,
  totalPages: 0,
  totalReviews: 0,
  isLoading: false,
  error: null,
  reviewStatus: null,

  setReviews: (reviews: Review[]) => set({ reviews }),

  getProductReviews: async (productId: string, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getProductReviews(productId, page, limit);
      set({
        reviews: response.reviews,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalReviews: response.totalReviews,
      });
    } catch (error) {
      set({ error: 'Failed to fetch reviews' });
      console.error('Error fetching reviews:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllReviews: async (page = 1, limit = 10, sort = '-createdAt') => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAllReviews(page, limit, sort);
      set({
        reviews: response.reviews,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalReviews: response.totalReviews,
      });
    } catch (error) {
      set({ error: 'Failed to fetch reviews' });
      console.error('Error fetching all reviews:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createReview: async (productId: string, reviewData: NewReview) => {
    set({ isLoading: true, error: null });
    try {
      await createReview(productId, reviewData);
      // Refresh reviews after creating a new one
      const response = await getProductReviews(productId);
      set({
        reviews: response.reviews,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalReviews: response.totalReviews,
      });
      // Also refresh the review status
      get().checkCanReview(productId);
    } catch (error) {
      set({ error: 'Failed to create review' });
      console.error('Error creating review:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  checkCanReview: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const status = await checkCanReview(productId);
      set({ reviewStatus: status });
    } catch (error) {
      set({ error: 'Failed to check review status' });
      console.error('Error checking review status:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
