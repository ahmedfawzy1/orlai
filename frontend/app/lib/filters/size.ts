import { Size, SizesResponse } from '@/app/types/filter';
import { axiosInstance } from '../axios';
import { ApiResponse } from '@/app/types/product';

export async function getSizes(): Promise<Size[]> {
  try {
    const res = await axiosInstance.get<SizesResponse>('/sizes');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}

export async function createSize(sizeData: Size): Promise<Size | null> {
  try {
    const res = await axiosInstance.post<ApiResponse<Size>>('/sizes', sizeData);
    return res.data.data;
  } catch (error) {
    console.error('Error creating size:', error);
    return null;
  }
}

export async function updateSize(
  id: string,
  updateData: Partial<Size>,
): Promise<Size | null> {
  try {
    const res = await axiosInstance.put<ApiResponse<Size>>(
      `/sizes/${id}`,
      updateData,
    );
    return res.data.data;
  } catch (error) {
    console.error('Error updating size:', error);
    return null;
  }
}

export async function deleteSize(id: string): Promise<boolean> {
  try {
    const res = await axiosInstance.delete<ApiResponse>(`/sizes/${id}`);
    return res.data.success;
  } catch (error) {
    console.error('Error deleting size:', error);
    return false;
  }
}
