import { axiosInstance } from './axios';

export const getAllWishlists = async () => {
  try {
    const response = await axiosInstance.get('/wishlist');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching wishlists:', error.response.data.message);
    return null;
  }
};

export const getWishlistById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/wishlist/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching wishlist:', error.response.data.message);
    return { products: [], _id: null, customer: userId };
  }
};

export const addToWishlist = async (userId: string, productId: string) => {
  try {
    const response = await axiosInstance.post('/wishlist', {
      userId,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return null;
  }
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  try {
    const response = await axiosInstance.delete('/wishlist', {
      data: { userId, productId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return null;
  }
};
