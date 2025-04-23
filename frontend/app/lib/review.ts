import axios from 'axios';

export async function getReviews() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/review`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching reviews', error);
    return error;
  }
}
