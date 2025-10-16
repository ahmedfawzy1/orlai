import { Category, CategoriesResponse } from '@/app/types/filter';
import { axiosInstance } from '../axios';
import { ApiResponse } from '@/app/types/product';

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await axiosInstance.get<CategoriesResponse>('/categories');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(
  categoryData: Category,
): Promise<Category> {
  try {
    const res = await axiosInstance.post<ApiResponse<Category>>(
      '/categories',
      categoryData,
    );
    return res.data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  updateData: Partial<Category>,
): Promise<Category> {
  try {
    const res = await axiosInstance.put<ApiResponse<Category>>(
      `/categories/${id}`,
      updateData,
    );
    return res.data.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const res = await axiosInstance.delete<ApiResponse>(`/categories/${id}`);
    return res.data.success;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    throw error;
  }
}
