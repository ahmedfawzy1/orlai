import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '../types/cart';
import { axiosInstance } from '../lib/axios';
import {
  addToCart as apiAddToCart,
  clearCart as apiClearCart,
  getCart as apiGetCart,
  removeFromCart as apiRemoveFromCart,
  updateCart as apiUpdateCart,
} from '../lib/cart';
import { toast } from 'react-hot-toast';
import { getSession } from 'next-auth/react';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  discount: string;
  discountApplied: boolean;
  discountAmount: number;
  couponInfo: any;
  delivery: number;
  getCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateCart: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setDiscount: (code: string) => void;
  applyDiscount: () => Promise<void>;
  syncLocalCartToBackend: () => Promise<void>;
  clearInvalidItems: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      loading: false,
      error: null,
      discount: '',
      discountApplied: false,
      discountAmount: 0,
      couponInfo: null,
      delivery: 5,

      getCart: async () => {
        set({ loading: true, error: null });
        try {
          const cart = await apiGetCart();
          set({ items: cart.items, total: cart.total });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
          //   set({ error: error.message });
          //   toast.error('Failed to load cart');
        } finally {
          set({ loading: false });
        }
      },

      addToCart: async item => {
        const { items, total } = get();

        // Check if item already exists (same product, variant, color, size)
        const existingItemIndex = items.findIndex(
          existingItem =>
            existingItem.product._id === item.product._id &&
            existingItem.variantId === item.variantId &&
            existingItem.color._id === item.color._id &&
            existingItem.size._id === item.size._id,
        );

        let updatedItems;
        let updatedTotal;

        if (existingItemIndex !== -1) {
          // Update existing item quantity
          updatedItems = items.map((existingItem, index) =>
            index === existingItemIndex
              ? {
                  ...existingItem,
                  quantity: existingItem.quantity + item.quantity,
                }
              : existingItem,
          );
          updatedTotal = updatedItems.reduce(
            (sum, i) =>
              sum + (i.product?.priceRange?.minVariantPrice || 0) * i.quantity,
            0,
          );
        } else {
          // Add new item
          updatedItems = [...items, item];
          updatedTotal =
            total +
            (item.product?.priceRange?.minVariantPrice || 0) * item.quantity;
        }

        set({ items: updatedItems, total: updatedTotal });
        toast.success('Item added to cart!');

        const session = await getSession();
        if (session?.user) {
          apiAddToCart(
            item.product._id,
            item.variantId,
            item.color.name,
            item.size.name,
            item.quantity,
          ).catch(() => toast.error('Failed to sync with backend'));
        }
      },

      updateCart: async (itemId, quantity) => {
        const { items } = get();
        const updatedItems = items.map(i =>
          i._id === itemId ? { ...i, quantity } : i,
        );
        const updatedTotal = updatedItems.reduce(
          (sum, i) =>
            sum + (i.product?.priceRange?.minVariantPrice || 0) * i.quantity,
          0,
        );

        set({ items: updatedItems, total: updatedTotal });
        toast.success('Quantity updated');

        const session = await getSession();
        if (session?.user) {
          apiUpdateCart(itemId, quantity).catch(() =>
            toast.error('Failed to sync quantity'),
          );
        }
      },

      removeFromCart: async itemId => {
        const { items } = get();
        const updatedItems = items.filter(i => i._id !== itemId);
        const updatedTotal = updatedItems.reduce(
          (sum, i) =>
            sum + (i.product?.priceRange?.minVariantPrice || 0) * i.quantity,
          0,
        );

        set({ items: updatedItems, total: updatedTotal });
        toast.success('Item removed');

        const session = await getSession();
        if (session?.user) {
          apiRemoveFromCart(itemId).catch(() =>
            toast.error('Failed to sync removal'),
          );
        }
      },

      clearCart: async () => {
        set({
          items: [],
          total: 0,
          discount: '',
          discountApplied: false,
          discountAmount: 0,
          couponInfo: null,
        });
        toast.success('Cart cleared');

        const session = await getSession();
        if (session?.user) {
          apiClearCart().catch(() =>
            toast.error('Failed to clear cart in backend'),
          );
        }
      },

      setDiscount: code => set({ discount: code }),

      applyDiscount: async () => {
        const { discount, discountApplied, items } = get();
        if (discountApplied) return;
        // Calculate subtotal
        const subtotal = items.reduce(
          (sum, item) =>
            sum +
            (item.product?.priceRange?.minVariantPrice || 0) * item.quantity,
          0,
        );
        try {
          const response = await axiosInstance.post('/coupons/validate', {
            code: discount,
            amount: subtotal,
          });
          const data = response.data;
          if (data.valid) {
            set({
              total: Math.max(0, subtotal - data.discountAmount),
              discountApplied: true,
              discountAmount: data.discountAmount,
              couponInfo: data.coupon,
            });
            toast.success('Discount applied!');
          } else {
            toast.error('Invalid coupon');
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Invalid coupon');
        }
      },

      syncLocalCartToBackend: async () => {
        const { items } = get();
        if (items.length === 0) return;

        // Check if user is authenticated before syncing
        const session = await getSession();
        if (!session?.user) {
          console.log('User not authenticated, skipping cart sync');
          return;
        }

        try {
          console.log('Starting cart sync for', items.length, 'items');

          // Group items by product variant to avoid duplicate requests
          const groupedItems = new Map();

          for (const item of items) {
            if (
              item.product?._id &&
              item.variantId &&
              item.color?.name &&
              item.size?.name
            ) {
              const key = `${item.product._id}-${item.variantId}-${item.color.name}-${item.size.name}`;

              if (groupedItems.has(key)) {
                groupedItems.get(key).quantity += item.quantity;
              } else {
                groupedItems.set(key, {
                  productId: item.product._id,
                  variantId: item.variantId,
                  color: item.color.name,
                  size: item.size.name,
                  quantity: item.quantity,
                });
              }
            } else {
              console.warn('Skipping invalid cart item:', item);
            }
          }

          // Sync grouped items to backend
          for (const [, item] of groupedItems) {
            try {
              await apiAddToCart(
                item.productId,
                item.variantId,
                item.color,
                item.size,
                item.quantity,
              );
            } catch (error: any) {
              console.error('Failed to sync item:', item, error);

              // If it's a stock issue, remove the item from local cart
              if (
                error.response?.status === 400 &&
                error.response?.data?.message?.includes('Insufficient stock')
              ) {
                console.log(
                  'Removing item with insufficient stock from local cart',
                );
                const { items: currentItems } = get();
                const updatedItems = currentItems.filter(
                  localItem =>
                    !(
                      localItem.product._id === item.productId &&
                      localItem.variantId === item.variantId &&
                      localItem.color.name === item.color &&
                      localItem.size.name === item.size
                    ),
                );
                set({ items: updatedItems });
                toast.error(
                  `Item removed from cart: ${error.response.data.message}`,
                );
              }
            }
          }

          console.log('Local cart synced to backend successfully');
        } catch (error: any) {
          console.error('Failed to sync local cart to backend:', error);
          if (error.response?.status === 401) {
            console.log('User not authenticated, redirecting to login');
            window.location.href = '/login';
          } else {
            toast.error('Failed to sync cart items to backend');
          }
        }
      },

      clearInvalidItems: () => {
        const { items } = get();
        const validItems = items.filter(
          item =>
            item.product?._id &&
            item.variantId &&
            item.color?._id &&
            item.size?._id &&
            item.quantity > 0,
        );

        if (validItems.length !== items.length) {
          const updatedTotal = validItems.reduce(
            (sum, i) =>
              sum + (i.product?.priceRange?.minVariantPrice || 0) * i.quantity,
            0,
          );
          set({ items: validItems, total: updatedTotal });
          console.log(
            `Cleared ${items.length - validItems.length} invalid cart items`,
          );
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        items: state.items,
        total: state.total,
        discount: state.discount,
        discountApplied: state.discountApplied,
        discountAmount: state.discountAmount,
        couponInfo: state.couponInfo,
      }),
    },
  ),
);
