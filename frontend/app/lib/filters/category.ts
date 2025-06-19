import { Category } from '@/app/types/filter';
import { axiosInstance } from '../axios';

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await axiosInstance.get('/categories');
    return res.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(
  categoryData: Category
): Promise<Category | null> {
  try {
    const res = await axiosInstance.post('/categories', categoryData);
    return res.data;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

export async function updateCategory(
  id: string,
  updateData: Partial<Category>
): Promise<Category | null> {
  try {
    const res = await axiosInstance.put(`/categories/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await axiosInstance.delete(`/categories/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}
