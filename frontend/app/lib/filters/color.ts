import axios from 'axios';
import { Color } from '@/app/types/filter';

export async function getColors(): Promise<Color[]> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/colors`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}

export async function createColor(colorData: Color): Promise<Color | null> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/colors`,
      colorData
    );
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
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/colors/${id}`,
      updateData
    );
    return res.data;
  } catch (error) {
    console.error('Error updating color:', error);
    return null;
  }
}

export async function deleteColor(id: string): Promise<boolean> {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/colors/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting color:', error);
    return false;
  }
}
