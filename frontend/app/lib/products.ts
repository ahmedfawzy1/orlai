import axios from 'axios';

export async function getProducts(page: number = 1, limit: number = 8) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalPages: 1 };
  }
}

export async function getAllBestSellingProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/bestsellers`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch bestsellers');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching bestSelling products:', error);
    return [];
  }
}

export async function getBestSellingProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/bestsellers?limit=4`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch bestsellers');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching bestSelling products:', error);
    return [];
  }
}
