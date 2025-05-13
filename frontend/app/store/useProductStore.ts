import { create } from 'zustand';
import { Product } from '../types/product';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../lib/products';

interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  searchQuery: string;
}

interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  totalPages: number;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;

  // State setters
  setProducts: (products: Product[], totalPages: number) => void;
  setSelectedProduct: (product: Product | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setError: (error: string | null) => void;

  // CRUD operations
  getProducts: (page: number, limit: number) => Promise<void>;
  getProduct: (id: string) => Promise<void>;
  createProduct: (productData: Product) => Promise<void>;
  updateProduct: (id: string, updateData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: Partial<FilterState>) => Promise<void>;

  // Initialization
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
  selectedProduct: null,
  totalPages: 0,
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
    })),

  resetFilters: () => set({ filters: initialFilters }),

  setError: (error: string | null) => set({ error }),

  getProducts: async (page: number, limit: number) => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = useProductStore.getState();
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.categories.length > 0 && {
          categories: filters.categories.join(','),
        }),
        ...(filters.colors.length > 0 && {
          colors: filters.colors.join(','),
        }),
        ...(filters.sizes.length > 0 && {
          sizes: filters.sizes.join(','),
        }),
        ...(filters.priceRange[0] > 0 && {
          minPrice: filters.priceRange[0].toString(),
        }),
        ...(filters.priceRange[1] < 250 && {
          maxPrice: filters.priceRange[1].toString(),
        }),
        ...(filters.searchQuery && {
          search: filters.searchQuery,
        }),
      });

      const response = await getProducts(page, limit, queryParams.toString());
      set({ products: response.products, totalPages: response.totalPages });
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
      set(state => ({
        products: [newProduct, ...state.products],
      }));
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
      set(state => ({
        products: state.products.map(product =>
          product._id === id ? updatedProduct : product
        ),
        selectedProduct:
          state.selectedProduct?._id === id
            ? updatedProduct
            : state.selectedProduct,
      }));
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

  searchProducts: async (query: Partial<FilterState>) => {
    set({ isLoading: true, error: null });
    try {
      const results = await searchProducts(query);
      set({ products: results });
    } catch (error) {
      set({ error: 'Failed to search products' });
      console.error('Error searching products:', error);
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
