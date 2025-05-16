import axios from 'axios';
import { Category } from '@/app/types/filter';

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`
    );
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
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
      categoryData
    );
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
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`,
      updateData
    );
    return res.data;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`
    );
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}
