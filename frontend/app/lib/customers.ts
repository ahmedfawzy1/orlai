import { axiosInstance } from './axios';

interface CustomerResponse {
  customers: any[];
  currentPage: number;
  totalPages: number;
  totalCustomers: number;
}

export async function getCustomers(
  page: number = 1,
  limit: number = 8,
  search: string = '',
): Promise<CustomerResponse> {
  try {
    const url = `/customers?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

export async function updateCustomer(id: string, customer: any) {
  try {
    const url = `/customers/${id}`;
    const res = await axiosInstance.put(url, customer);
    return res.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

export async function deleteCustomer(id: string) {
  try {
    const url = `/customers/${id}`;
    const res = await axiosInstance.delete(url);

    return res.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}
