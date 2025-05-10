'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/app/types/product';
import { Heart, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ItemCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  //   useEffect(() => {
  //     if (!userId) return
  //     const fetchWishlist = async () => {
  //         const res = await fetch(`/api/wishlist?userId=${userId}`);
  //         const data = await res.json();
  //         setIsWishlisted(data.isWishlisted);
  //     }
  //     fetchWishlist();
  //   }, [productId]);

  const toggleWishlist = () => {
    // if (!userId) {
    //     toast.error('⚠️ Please login to add items to your wishlist');
    //     return;
    //   }
    if (isWishlisted) {
      setIsWishlisted(false);
      toast.success('Removed from your wishlist');
      //   await removeFromWishlist(productId);
    } else {
      setIsWishlisted(true);
      toast.success('Added to your wishlist');
      //   await addToWishlist(productId);
    }
  };

  return (
    <div className='w-full h-full rounded-xl flex flex-col items-center group'>
      <div className='w-full aspect-[3/4] bg-[#fafafa] relative flex justify-center items-center overflow-hidden'>
        <Link href={`/shop/${product.slug}`} className='w-full h-full'>
          <Image
            src={product.image}
            alt={product.name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            width={780}
            height={1196}
            priority={false}
            draggable={false}
          />
        </Link>

        <div className='w-full h-full absolute z-30'>
          <div className='flex flex-col gap-3 absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300'>
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist();
              }}
              className={`bg-white p-3 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer ${
                isWishlisted ? 'text-red-500' : 'text-gray-500'
              }`}
              aria-label='add to wishlist'
            >
              <Heart size={20} fill={isWishlisted ? 'red' : 'none'} />
            </button>
            <Link
              href={`/shop/${product.slug}`}
              className='bg-white text-gray-500 p-3 rounded-full hover:bg-gray-100 transition-all duration-300'
              aria-label='view product'
            >
              <Eye size={20} />
            </Link>
          </div>
        </div>
        <button
          className='px-4 py-2 text-black text-lg font-medium text-center w-[calc(100%-2rem)] absolute bottom-5 left-1/2 z-50 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white rounded-lg hover:scale-105 hover:bg-gray-100 transition-all duration-300 transform-gpu cursor-pointer'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Add to Cart
        </button>
      </div>

      <div className='w-full mt-4 space-y-2'>
        <Link href={`/shop/${product.slug}`} className='block'>
          <h3 className='text-lg font-bold truncate'>{product.name}</h3>
        </Link>
        <p className='text-md text-black/70 font-medium'>{product.category}</p>
        <div className='flex gap-2'>
          <p className='text-lg font-bold'>${product.maxPrice}</p>
          {product.minPrice > 0 && (
            <p className='text-[#000000a6] text-lg font-bold line-through'>
              ${product.minPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
