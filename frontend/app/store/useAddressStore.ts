import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface Address {
  _id: string;
  name: string;
  phone: string;
  flatHouse: string;
  area: string;
  city: string;
  pinCode: string;
  state: string;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (data: Omit<Address, '_id'>) => Promise<boolean>;
  updateAddress: (
    id: string,
    data: Partial<Omit<Address, '_id'>>
  ) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
}

export const useAddressStore = create<AddressState>(set => ({
  addresses: [],
  isLoading: false,

  fetchAddresses: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/address');
      set({ addresses: res.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch addresses'
        );
      }
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async data => {
    try {
      const res = await axiosInstance.post('/address', data);
      set(state => ({ addresses: [...state.addresses, res.data] }));
      toast.success('Address added successfully');
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to add address');
      }
      return false;
    }
  },

  updateAddress: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/address/${id}`, data);
      set(state => ({
        addresses: state.addresses.map(addr =>
          addr._id === id ? res.data : addr
        ),
      }));
      toast.success('Address updated successfully');
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || 'Failed to update address'
        );
      }
      return false;
    }
  },

  deleteAddress: async id => {
    try {
      await axiosInstance.delete(`/address/${id}`);
      set(state => ({
        addresses: state.addresses.filter(addr => addr._id !== id),
      }));
      toast.success('Address deleted successfully');
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || 'Failed to delete address'
        );
      }
      return false;
    }
  },
}));
