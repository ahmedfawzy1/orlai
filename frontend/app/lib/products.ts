import { axiosInstance } from './axios';
import { Product } from '../types/product';

export async function getProducts(
  page: number = 1,
  limit: number = 8,
  queryParams: {
    category?: string;
    min_price?: number;
    max_price?: number;
    color?: string;
    size?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
  } = {}
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(queryParams.category && { category: queryParams.category }),
      ...(queryParams.min_price && {
        min_price: queryParams.min_price.toString(),
      }),
      ...(queryParams.max_price && {
        max_price: queryParams.max_price.toString(),
      }),
      ...(queryParams.color && { color: queryParams.color }),
      ...(queryParams.size && { size: queryParams.size }),
      ...(queryParams.sort && { sort: queryParams.sort }),
      ...(queryParams.order && { order: queryParams.order }),
      ...(queryParams.search && { search: queryParams.search }),
    });

    const res = await axiosInstance.get(`/products?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      total_count: 0,
      total_pages: 1,
      current_page: page,
      per_page: limit,
    };
  }
}

export async function getAllBestSellingProducts() {
  try {
    const res = await axiosInstance.get('/products/bestsellers');
    return res.data;
  } catch (error) {
    console.error('Error fetching bestSelling products:', error);
    return [];
  }
}

export async function getBestSellingProducts() {
  try {
    const res = await axiosInstance.get('/products/bestsellers?limit=4');
    return res.data;
  } catch (error) {
    console.error('Error fetching bestSelling products:', error);
    return [];
  }
}

export async function getProduct(id: string) {
  try {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function createProduct(productData: Product) {
  try {
    const res = await axiosInstance.post('/products', productData);
    return res.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function updateProduct(id: string, updateData: Partial<Product>) {
  try {
    const res = await axiosInstance.put(`/products/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string) {
  try {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    return null;
  }
}
