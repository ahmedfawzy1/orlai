import { axiosInstance } from './axios';

export async function getReviews() {
  try {
    const res = await axiosInstance.get('/review');
    return res.data;
  } catch (error) {
    console.error('Error fetching reviews', error);
    return error;
  }
}
