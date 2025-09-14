import Shop from './client';
import generateSEO from '../lib/seo';
import { getProducts } from '../lib/products';
import { getFilters } from '../lib/filters/filters';

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

async function getShopData(page: number = 1, limit: number = 12) {
  try {
    const response = await getProducts(page, limit);
    return {
      products: response.products || [],
      totalPages: response.total_pages || 0,
      currentPage: response.current_page || 1,
      totalCount: response.total_count || 0,
    };
  } catch (error) {
    console.error('Error fetching shop data:', error);
    return {
      products: [],
      totalPages: 0,
      currentPage: 1,
      totalCount: 0,
    };
  }
}

async function getFilterData() {
  try {
    const filters = await getFilters();
    return {
      categories: filters.categories || [],
      colors: filters.colors || [],
      sizes: filters.sizes || [],
    };
  } catch (error) {
    console.error('Error fetching filter data:', error);
    return {
      categories: [],
      colors: [],
      sizes: [],
    };
  }
}

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Discover Our Collection | Orlai',
    description:
      'Shop the latest trends and find your perfect style at Orlai. Explore our curated collection of high-quality clothing for men, women, and kids.',
  });
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const [initialData, filterData] = await Promise.all([
    getShopData(page, 12),
    getFilterData(),
  ]);

  return <Shop initialData={initialData} filterData={filterData} />;
}
