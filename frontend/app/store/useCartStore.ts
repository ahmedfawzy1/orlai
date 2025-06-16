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
        const updatedItems = [...items, item];
        const updatedTotal =
          total +
          (item.product?.priceRange?.minVariantPrice || 0) * item.quantity;

        set({ items: updatedItems, total: updatedTotal });
        toast.success('Item added to cart!');

        // Fire and forget
        apiAddToCart(
          item.product._id,
          item.variantId,
          item.color.name,
          item.size.name,
          item.quantity
        ).catch(() => toast.error('Failed to sync with backend'));
      },

      updateCart: async (itemId, quantity) => {
        const { items } = get();
        const updatedItems = items.map(i =>
          i._id === itemId ? { ...i, quantity } : i
        );
        const updatedTotal = updatedItems.reduce(
          (sum, i) =>
            sum + (i.product?.priceRange?.minVariantPrice || 0) * i.quantity,
          0
        );

        set({ items: updatedItems, total: updatedTotal });
        toast.success('Quantity updated');

        apiUpdateCart(itemId, quantity).catch(() =>
          toast.error('Failed to sync quantity')
        );
      },

      removeFromCart: async itemId => {
        const { items } = get();
        const updatedItems = items.filter(i => i._id !== itemId);
        const updatedTotal = updatedItems.reduce(
          (sum, i) =>
            sum + (i.product?.priceRange?.minVariantPrice || 0) * i.quantity,
          0
        );

        set({ items: updatedItems, total: updatedTotal });
        toast.success('Item removed');

        apiRemoveFromCart(itemId).catch(() =>
          toast.error('Failed to sync removal')
        );
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

        apiClearCart().catch(() =>
          toast.error('Failed to clear cart in backend')
        );
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
          0
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
    }
  )
);
