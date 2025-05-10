import { create } from 'zustand';
import { Review } from '../types/review';
import { getReviews, addReview } from '../lib/reviews';

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  setReviews: (reviews: Review[]) => void;
  getReviews: (productId: string) => Promise<void>;
  createReview: (
    productId: string,
    reviewData: Omit<Review, 'product'>
  ) => Promise<void>;
}

export const useReviewStore = create<ReviewStore>(set => ({
  reviews: [],
  isLoading: false,
  setReviews: (reviews: Review[]) => set({ reviews }),

  getReviews: async (productId: string) => {
    set({ isLoading: true });
    try {
      const response = await getReviews(productId);
      set({ reviews: response.reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createReview: async (
    productId: string,
    reviewData: Omit<Review, 'product'>
  ) => {
    set({ isLoading: true });
    try {
      await addReview(productId, reviewData);
      await useReviewStore.getState().getReviews(productId);
    } catch (error) {
      console.error('Error creating review:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
