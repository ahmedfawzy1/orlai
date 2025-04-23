import axios from 'axios';

export async function getProducts() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
export async function getBestSellingProducts() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/bestsellers?limit=4`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching bestSelling products:', error);
    return [];
  }
}
