import axios from 'axios';
import { Product, SearchQuery } from '../types/product';

export async function getProducts(
  page: number = 1,
  limit: number = 8,
  queryParams: string = ''
) {
  try {
    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`;

    if (queryParams) {
      url = `${url}?${page}&${limit}&${queryParams}`;
    } else {
      url = `${url}?page=${page}&limit=${limit}`;
    }

    const res = await axios.get(url);
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

export async function getProductById(id: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function createProduct(productData: Product) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
      productData
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function updateProduct(id: string, updateData: Partial<Product>) {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
      updateData
    );
    return res.data;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`
    );
    return res.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    return null;
  }
}

export async function searchProducts(query: SearchQuery) {
  try {
    const queryParams = new URLSearchParams({
      ...(query.categories &&
        query.categories.length > 0 && {
          categories: query.categories.join(','),
        }),
      ...(query.colors &&
        query.colors.length > 0 && {
          colors: query.colors.join(','),
        }),
      ...(query.sizes &&
        query.sizes.length > 0 && {
          sizes: query.sizes.join(','),
        }),
      ...(query.priceRange &&
        query.priceRange[0] > 0 && {
          minPrice: query.priceRange[0].toString(),
        }),
      ...(query.priceRange &&
        query.priceRange[1] < 250 && {
          maxPrice: query.priceRange[1].toString(),
        }),
      ...(query.searchQuery && { search: query.searchQuery }),
    });

    const res = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/products/search?${queryParams.toString()}`
    );

    return res.data;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}
