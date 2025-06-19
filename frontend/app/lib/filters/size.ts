import { Size } from '@/app/types/filter';
import { axiosInstance } from '../axios';

export async function getSizes(): Promise<Size[]> {
  try {
    const res = await axiosInstance.get('/sizes');
    return res.data;
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}

export async function createSize(sizeData: Size): Promise<Size | null> {
  try {
    const res = await axiosInstance.post('/sizes', sizeData);
    return res.data;
  } catch (error) {
    console.error('Error creating size:', error);
    return null;
  }
}

export async function updateSize(
  id: string,
  updateData: Partial<Size>
): Promise<Size | null> {
  try {
    const res = await axiosInstance.put(`/sizes/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error('Error updating size:', error);
    return null;
  }
}

export async function deleteSize(id: string): Promise<boolean> {
  try {
    await axiosInstance.delete(`/sizes/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting size:', error);
    return false;
  }
}
