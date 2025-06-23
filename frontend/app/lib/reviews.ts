import { axiosInstance } from './axios';
import { Review, ReviewResponse, NewReview } from '../types/review';

export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10
): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.get(`/reviews/${productId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { reviews: [], currentPage: 1, totalPages: 0, totalReviews: 0 };
    }
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getAllReviews = async (
  page = 1,
  limit = 10,
  sort = '-createdAt'
): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.get('/reviews', {
      params: { page, limit, sort },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { reviews: [], currentPage: 1, totalPages: 0, totalReviews: 0 };
    }
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

export const createReview = async (
  productId: string,
  reviewData: NewReview
): Promise<Review> => {
  try {
    const response = await axiosInstance.post('/reviews', {
      ...reviewData,
      productId,
    });
    return response.data.review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const checkCanReview = async (
  productId: string
): Promise<{
  canReview: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
  message: string;
}> => {
  try {
    const response = await axiosInstance.get(
      `/reviews/${productId}/can-review`
    );
    return response.data;
  } catch (error) {
    console.error('Error checking review status:', error);
    throw error;
  }
};
