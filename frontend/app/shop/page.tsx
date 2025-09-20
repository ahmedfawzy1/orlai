import Shop from './client';
import generateSEO from '../lib/seo';
import { getProducts } from '../lib/products';
import { getFilters } from '../lib/filters/filters';

export const revalidate = 3600;

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
    getProducts(page, 12),
    getFilters(),
  ]);

  return <Shop initialData={initialData} filterData={filterData} />;
}
