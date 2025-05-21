import Link from 'next/link';
import ItemCard from '../shop/ItemCard';
import { getBestSellingProducts } from '@/app/lib/products';
import { Product } from '@/app/types/product';

export default async function BestSelling() {
  // const bestSellingProducts = await getBestSellingProducts();
  const bestSellingProducts = [];

  return (
    <section className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12'>
      <h4 className='text-3xl md:text-[42px] font-semibold text-center'>
        Our BestSeller
      </h4>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-10 pb-8'>
        {bestSellingProducts?.map((product: Product) => (
          <ItemCard key={product.id} product={product} />
        ))}
      </div>

      <div className='text-center'>
        <Link
          className='inline-block px-6 md:px-10 py-3 rounded-full text-gray-800 bg-white border-2 border-gray-800 shadow-sm hover:bg-gray-800 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 font-medium'
          href='/bestseller'
          prefetch={false}
        >
          View All
        </Link>
      </div>
    </section>
  );
}
