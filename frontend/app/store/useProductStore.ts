import { create } from 'zustand';
import { Product } from '../types/product';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../lib/products';

interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  searchQuery: string;
  sort: string;
  order: 'asc' | 'desc';
}

interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  totalPages: number;
  currentPage: number;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;

  // State setters
  setProducts: (products: Product[], totalPages: number) => void;
  setSelectedProduct: (product: Product | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;

  // CRUD operations
  getProducts: (page: number, limit: number) => Promise<void>;
  getProduct: (id: string) => Promise<void>;
  createProduct: (productData: Product) => Promise<void>;
  updateProduct: (id: string, updateData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Initialization
  init: () => void;
}

const initialFilters: FilterState = {
  categories: [],
  colors: [],
  sizes: [],
  priceRange: [0, 250],
  searchQuery: '',
  sort: 'createdAt',
  order: 'desc',
};

export const useProductStore = create<ProductStore>()(set => ({
  products: [],
  selectedProduct: null,
  totalPages: 0,
  currentPage: 1,
  filters: initialFilters,
  isLoading: false,
  error: null,

  setProducts: (products: Product[], totalPages: number) =>
    set({ products, totalPages }),

  setSelectedProduct: (product: Product | null) =>
    set({ selectedProduct: product }),

  setFilters: (newFilters: Partial<FilterState>) =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    })),

  resetFilters: () => set({ filters: initialFilters, currentPage: 1 }),

  setError: (error: string | null) => set({ error }),

  setCurrentPage: (page: number) => set({ currentPage: page }),

  getProducts: async (page: number, limit: number) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = useProductStore.getState();
      const queryParams = {
        page,
        limit,
        ...(filters.categories.length > 0 && {
          category: filters.categories.join(','),
        }),
        ...(filters.colors.length > 0 && {
          color: filters.colors.join(','),
        }),
        ...(filters.sizes.length > 0 && {
          size: filters.sizes.join(','),
        }),
        ...(filters.priceRange[0] > 0 && {
          min_price: filters.priceRange[0],
        }),
        ...(filters.priceRange[1] < 250 && {
          max_price: filters.priceRange[1],
        }),
        ...(filters.searchQuery && {
          search: filters.searchQuery,
        }),
        ...(filters.sort && {
          sort: filters.sort,
          order: filters.order,
        }),
      };

      const response = await getProducts(page, limit, queryParams);
      set({
        products: response.products,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      });
    } catch (error) {
      set({ error: 'Failed to fetch products' });
      console.error('Error fetching products:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await getProduct(id);
      set({ selectedProduct: product });
    } catch (error) {
      set({ error: 'Failed to fetch product details' });
      console.error('Error fetching product:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (productData: Product) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await createProduct(productData);
      if (newProduct) {
        set(state => ({
          products: [newProduct, ...state.products],
        }));
      } else {
        set({ error: 'Failed to create product' });
      }
    } catch (error) {
      set({ error: 'Failed to create product' });
      console.error('Error creating product:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id: string, updateData: Partial<Product>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await updateProduct(id, updateData);
      if (updatedProduct) {
        set(state => ({
          products: state.products.map(product =>
            product._id === id ? updatedProduct : product,
          ),
          selectedProduct:
            state.selectedProduct?._id === id
              ? updatedProduct
              : state.selectedProduct,
        }));
      } else {
        set({ error: 'Failed to update product' });
      }
    } catch (error) {
      set({ error: 'Failed to update product' });
      console.error('Error updating product:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProduct(id);
      set(state => ({
        products: state.products.filter(product => product._id !== id),
        selectedProduct:
          state.selectedProduct?._id === id ? null : state.selectedProduct,
      }));
    } catch (error) {
      set({ error: 'Failed to delete product' });
      console.error('Error deleting product:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  init: () => {
    const store = useProductStore.getState();
    store.getProducts(1, 12);
  },
}));
