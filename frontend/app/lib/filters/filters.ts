import { axiosInstance } from '../axios';
import { Filter } from '@/app/types/filter';

export async function getFilters(): Promise<Filter> {
  try {
    const res = await axiosInstance.get('/filters');
    return res.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    return {
      categories: [],
      colors: [],
      sizes: [],
    };
  }
}
