import { Color } from '@/app/types/filter';
import { axiosInstance } from '../axios';

export async function getColors(): Promise<Color[]> {
  try {
    const res = await axiosInstance.get('/colors');
    return res.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}

export async function createColor(colorData: Color): Promise<Color | null> {
  try {
    const res = await axiosInstance.post('/colors', colorData);
    return res.data;
  } catch (error) {
    console.error('Error creating color:', error);
    return null;
  }
}

export async function updateColor(
  id: string,
  updateData: Partial<Color>
): Promise<Color | null> {
  try {
    const res = await axiosInstance.put(`/colors/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error('Error updating color:', error);
    return null;
  }
}

export async function deleteColor(id: string): Promise<boolean> {
  try {
    await axiosInstance.delete(`/colors/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting color:', error);
    return false;
  }
}
