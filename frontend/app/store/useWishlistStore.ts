import { create } from 'zustand';
import { Product } from '../types/product';
import {
  getWishlistById,
  addToWishlist,
  removeFromWishlist,
} from '../lib/wishlist';

interface WishlistStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchWishlist: (userId: string) => Promise<void>;
  addToWishlist: (userId: string, productId: string) => Promise<void>;
  removeFromWishlist: (userId: string, productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchWishlist: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getWishlistById(userId);
      set({ products: response?.products || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to fetch wishlist',
        isLoading: false,
      });
    }
  },

  addToWishlist: async (userId: string, productId: string) => {
    set({ isLoading: true, error: null });
    try {
      await addToWishlist(userId, productId);
      const response = await getWishlistById(userId);
      set({ products: response?.products || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Failed to add to wishlist',
        isLoading: false,
      });
    }
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    set({ isLoading: true, error: null });
    try {
      await removeFromWishlist(userId, productId);
      const response = await getWishlistById(userId);
      set({ products: response?.products || [], isLoading: false });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || 'Failed to remove from wishlist',
        isLoading: false,
      });
    }
  },

  isInWishlist: (productId: string) => {
    return get().products.some(product => product._id === productId);
  },
}));
