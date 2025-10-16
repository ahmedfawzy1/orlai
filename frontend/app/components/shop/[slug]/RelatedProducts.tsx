import { Product } from '@/app/types/product';
import React from 'react';
import ItemCard from '../ItemCard';

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className='flex flex-col md:flex-row gap-10 mt-10 max-w-[1280px] mx-auto'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl font-bold'>Related Products</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {products.map((product: Product) => (
            <ItemCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
