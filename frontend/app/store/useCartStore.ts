import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '../types/cart';
import { toast } from 'react-hot-toast';
import {
  addToCart as apiAddToCart,
  clearCart as apiClearCart,
  getCart as apiGetCart,
  removeFromCart as apiRemoveFromCart,
  updateCart as apiUpdateCart,
} from '../lib/cart';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  discount: string;
  discountApplied: boolean;
  delivery: number;
  getCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateCart: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setDiscount: (code: string) => void;
  applyDiscount: () => void;
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
        set({ items: [], total: 0 });
        toast.success('Cart cleared');

        apiClearCart().catch(() =>
          toast.error('Failed to clear cart in backend')
        );
      },

      setDiscount: code => set({ discount: code }),

      applyDiscount: () => {
        const { discount, discountApplied, total } = get();
        if (discountApplied) return;
        let discountAmount = 0;
        if (discount.trim().toUpperCase() === 'FLAT50') {
          discountAmount = total * 0.5;
        }
        set({
          total: Math.max(0, total - discountAmount),
          discountApplied: true,
        });
        toast.success('Discount applied!');
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
      }),
    }
  )
);
