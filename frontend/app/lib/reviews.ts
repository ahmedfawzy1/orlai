import axios from 'axios';
import { Review } from '../types/review';

export const getReviews = async (productId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}/reviews`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { reviews: [] };
  }
};

export const addReview = async (
  productId: string,
  reviewData: Omit<Review, 'product'>
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};
