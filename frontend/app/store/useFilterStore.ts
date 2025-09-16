import { create } from 'zustand';
import { Category, Color, Size } from '../types/filter';
import { getFilters } from '../lib/filters/filters';

interface FilterState {
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  isLoading: boolean;
  error: string | null;
}

interface FilterStore extends FilterState {
  getFilters: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
  setColors: (colors: Color[]) => void;
  setSizes: (sizes: Size[]) => void;
  init: () => Promise<void>;
}

export const useFilterStore = create<FilterStore>(set => ({
  categories: [],
  colors: [],
  sizes: [],
  isLoading: false,
  error: null,

  getFilters: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getFilters();

      set({
        categories: response.categories,
        colors: response.colors,
        sizes: response.sizes,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  setCategories: (categories: Category[]) => set({ categories }),
  setColors: (colors: Color[]) => set({ colors }),
  setSizes: (sizes: Size[]) => set({ sizes }),

  init: async () => {
    const store = useFilterStore.getState();
    await store.getFilters();
  },
}));
