import { create } from 'zustand';
import { Product } from '../types/product';
import { getProducts } from '../lib/products';

interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  searchQuery: string;
}

interface ProductStore {
  products: Product[];
  totalPages: number;
  filters: FilterState;
  isLoading: boolean;
  setProducts: (products: Product[], totalPages: number) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  getProducts: (page: number, limit: number) => Promise<void>;
  init: () => void;
}

const initialFilters: FilterState = {
  categories: [],
  colors: [],
  sizes: [],
  priceRange: [0, 250],
  searchQuery: '',
};

export const useProductStore = create<ProductStore>()(set => ({
  products: [],
  totalPages: 0,
  filters: initialFilters,
  isLoading: false,
  setProducts: (products: Product[], totalPages: number) =>
    set({ products, totalPages }),

  setFilters: (newFilters: Partial<FilterState>) =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  getProducts: async (page: number, limit: number) => {
    set({ isLoading: true });
    try {
      //   const { filters } = useProductStore.getState();
      //   const queryParams = new URLSearchParams({
      //     page: page.toString(),
      //     limit: limit.toString(),
      //     ...(filters.categories.length > 0 && {
      //       categories: filters.categories.join(','),
      //     }),
      //     ...(filters.colors.length > 0 && {
      //       colors: filters.colors.join(','),
      //     }),
      //     ...(filters.sizes.length > 0 && {
      //       sizes: filters.sizes.join(','),
      //     }),
      //     ...(filters.priceRange[0] > 0 && {
      //       minPrice: filters.priceRange[0].toString(),
      //     }),
      //     ...(filters.priceRange[1] < 250 && {
      //       maxPrice: filters.priceRange[1].toString(),
      //     }),
      //     ...(filters.searchQuery && {
      //       search: filters.searchQuery,
      //     }),
      //   });

      const response = await getProducts(page, limit);
      console.log(response);
      set({ products: response.products, totalPages: response.totalPages });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ products: [], totalPages: 1 });
    } finally {
      set({ isLoading: false });
    }
  },

  init: () => {
    const store = useProductStore.getState();
    store.getProducts(1, 12);
  },
}));

// Initialize the store
useProductStore.getState().init();
