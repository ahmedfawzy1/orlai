import { axiosInstance } from './axios';
import { Cart } from '../types/cart';

export const getCart = async (): Promise<Cart> => {
  const response = await axiosInstance.get('/cart');
  return response.data;
};

export const addToCart = async (
  productId: string,
  variantId: string,
  color: string,
  size: string,
  quantity: number,
): Promise<Cart | null> => {
  const response = await axiosInstance.post('/cart', {
    productId,
    variantId,
    color,
    size,
    quantity,
  });
  return response.data;
};

export const updateCart = async (
  itemId: string,
  quantity: number,
): Promise<Cart> => {
  const response = await axiosInstance.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId: string): Promise<Cart | null> => {
  const response = await axiosInstance.delete(`/cart/${itemId}`);
  return response.data;
};

export const clearCart = async (): Promise<boolean> => {
  const response = await axiosInstance.delete('/cart');
  return response.data;
};
