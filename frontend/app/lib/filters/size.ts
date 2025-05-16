import axios from 'axios';
import { Size } from '@/app/types/filter';

export async function getSizes(): Promise<Size[]> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sizes`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}

export async function createSize(sizeData: Size): Promise<Size | null> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sizes`,
      sizeData
    );
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
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sizes/${id}`,
      updateData
    );
    return res.data;
  } catch (error) {
    console.error('Error updating size:', error);
    return null;
  }
}

export async function deleteSize(id: string): Promise<boolean> {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sizes/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting size:', error);
    return false;
  }
}
