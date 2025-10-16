import React from 'react';
import { getAllBestSellingProducts } from '../lib/products';
import { Product } from '../types/product';
import ItemCard from '../components/shop/ItemCard';
import generateSEO from '../lib/seo';

export const revalidate = 3600;

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Best Sellers | Orlai',
    description:
      'Discover our best-selling products at Orlai. Shop the most popular items that have been loved by our customers.',
  });
};

export default async function bestseller() {
  const products = await getAllBestSellingProducts();

  return (
    <section className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12'>
      <h4 className='text-3xl md:text-[42px] font-bold text-center'>
        Our BestSeller
      </h4>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-10 pb-8'>
        {products?.map((product: Product) => (
          <ItemCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
