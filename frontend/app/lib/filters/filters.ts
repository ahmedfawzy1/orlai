import axios from 'axios';
import { Filter } from '@/app/types/filter';

export async function getFilters(): Promise<Filter> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/filters`
    );
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
