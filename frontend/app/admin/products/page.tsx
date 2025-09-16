import Client from './Client';
import { getProducts } from '@/app/lib/products';
import { getFilters } from '@/app/lib/filters/filters';

export default async function page() {
  const [productsData, filtersData] = await Promise.all([
    getProducts(1, 50),
    getFilters(),
  ]);

  return (
    <Client
      initialProducts={productsData.products}
      initialCategories={filtersData.categories}
    />
  );
}
