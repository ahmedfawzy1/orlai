import { create } from 'zustand';
import { getCustomers, updateCustomer, deleteCustomer } from '../lib/customers';

interface Customer {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCustomers: number;
}

interface CustomerStore {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
  searchQuery: string;
  setCustomers: (customers: Customer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationData) => void;
  setSearchQuery: (query: string) => void;
  addCustomer: (customer: Customer) => void;
  getCustomers: (
    page?: number,
    limit?: number,
    search?: string,
  ) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  updateCustomerApi: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>(set => ({
  customers: [],
  loading: false,
  error: null,
  searchQuery: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
  },
  setCustomers: customers => set({ customers }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setPagination: pagination => set({ pagination }),
  setSearchQuery: query => set({ searchQuery: query }),
  addCustomer: customer =>
    set(state => ({ customers: [...state.customers, customer] })),
  updateCustomer: (id, updatedCustomer) =>
    set(state => ({
      customers: state.customers.map(customer =>
        customer._id === id ? { ...customer, ...updatedCustomer } : customer,
      ),
    })),

  getCustomers: async (page = 1, limit = 8, search = '') => {
    try {
      set({ loading: true, error: null, searchQuery: search });
      const response = await getCustomers(page, limit, search);
      set({
        customers: response.customers,
        pagination: {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalCustomers: response.totalCustomers,
        },
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch customers',
        loading: false,
      });
    }
  },

  updateCustomerApi: async (id, updatedCustomer) => {
    try {
      set({ loading: true, error: null });
      const response = await updateCustomer(id, updatedCustomer);
      if (!response) throw new Error('Failed to update customer');

      set(state => ({
        customers: state.customers.map(customer =>
          customer._id === id ? { ...customer, ...response } : customer,
        ),
        loading: false,
      }));

      return response;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to update customer',
        loading: false,
      });
      throw error;
    }
  },

  deleteCustomer: async id => {
    try {
      set({ loading: true, error: null });
      const response = await deleteCustomer(id);
      if (!response) throw new Error('Failed to delete customer');

      set(state => ({
        customers: state.customers.filter(customer => customer._id !== id),
        loading: false,
      }));

      return response;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to delete customer',
        loading: false,
      });
      throw error;
    }
  },
}));
