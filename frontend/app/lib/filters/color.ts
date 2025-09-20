import { axiosInstance } from '../axios';
import { ApiResponse } from '@/app/types/product';
import { Color, ColorsResponse } from '@/app/types/filter';

export async function getColors(): Promise<Color[]> {
  try {
    const res = await axiosInstance.get<ColorsResponse>('/colors');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}

export async function createColor(colorData: Color): Promise<Color | null> {
  try {
    const res = await axiosInstance.post<ApiResponse<Color>>(
      '/colors',
      colorData,
    );
    return res.data.data;
  } catch (error) {
    console.error('Error creating color:', error);
    return null;
  }
}

export async function updateColor(
  id: string,
  updateData: Partial<Color>,
): Promise<Color | null> {
  try {
    const res = await axiosInstance.put<ApiResponse<Color>>(
      `/colors/${id}`,
      updateData,
    );
    return res.data.data;
  } catch (error) {
    console.error('Error updating color:', error);
    return null;
  }
}

export async function deleteColor(id: string): Promise<boolean> {
  try {
    const res = await axiosInstance.delete<ApiResponse>(`/colors/${id}`);
    return res.data.success;
  } catch (error) {
    console.error('Error deleting color:', error);
    return false;
  }
}
