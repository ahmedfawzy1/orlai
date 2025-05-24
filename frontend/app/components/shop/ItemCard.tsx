'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Product } from '@/app/types/product';
import { Heart, Eye, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/app/store/useAuthStore';
import {
  getWishlistById,
  addToWishlist,
  removeFromWishlist,
} from '@/app/lib/wishlist';

export default function ItemCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authUser } = useAuthStore();
  const userId = authUser?._id;

  useEffect(() => {
    if (!userId) return;
    const fetchWishlist = async () => {
      try {
        const res = await getWishlistById(userId);
        setIsWishlisted(res?.products?.some((p: any) => p._id === product._id));
      } catch (error: any) {
        setIsWishlisted(false);
        toast.error('Failed to load wishlist status');
        console.error('Error fetching wishlist:', error.response.data);
      }
    };
    fetchWishlist();
  }, [userId, product._id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error('Please login to add items to your wishlist');
      return;
    }

    setIsLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(userId, product._id);
        setIsWishlisted(false);
        toast.success('Removed from your wishlist');
      } else {
        await addToWishlist(userId, product._id);
        setIsWishlisted(true);
        toast.success('Added to your wishlist');
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error.response.data);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full h-full rounded-xl flex flex-col items-center group'>
      <div className='w-full aspect-[3/4] bg-[#fafafa] relative flex justify-center items-center overflow-hidden'>
        <Link href={`/shop/${product.slug}`} className='w-full h-full'>
          <Image
            src={product.images[0]}
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
              onClick={toggleWishlist}
              disabled={isLoading}
              className={`bg-white p-3 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer ${
                isWishlisted ? 'text-red-500' : 'text-gray-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={
                isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              {isLoading ? (
                <Loader2 size={20} className='animate-spin' />
              ) : (
                <Heart size={20} fill={isWishlisted ? 'red' : 'none'} />
              )}
            </button>
            <Link
              href={`/shop/${product.slug}`}
              className='bg-white text-gray-500 p-3 rounded-full hover:bg-gray-100 transition-all duration-300'
              aria-label='View product details'
            >
              <Eye size={20} />
            </Link>
          </div>
        </div>
        <button
          className='px-4 py-2 text-black text-lg font-medium text-center w-[calc(100%-2rem)] absolute bottom-5 left-1/2 z-50 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white rounded-lg hover:scale-105 hover:bg-gray-100 transition-all duration-300 transform-gpu cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          disabled={!product.availableForSale || product.inventory === 0}
          aria-label={
            product.availableForSale && product.inventory > 0
              ? 'Add to cart'
              : 'Product unavailable'
          }
        >
          {product.availableForSale && product.inventory > 0
            ? 'Add to Cart'
            : 'Out of Stock'}
        </button>
      </div>

      <div className='w-full mt-4 space-y-2'>
        <Link
          href={`/shop/${product.slug}`}
          className='block hover:opacity-80 transition-opacity'
        >
          <h3 className='text-lg font-bold truncate'>{product.name}</h3>
        </Link>
        <p className='text-md text-black/70 font-medium'>{product.category}</p>
        <div className='flex gap-2 items-center'>
          <p className='text-lg font-bold'>
            ${product.priceRange.maxVariantPrice}
          </p>
          {product.priceRange.minVariantPrice > 0 && (
            <p className='text-[#000000a6] text-lg font-bold line-through'>
              ${product.priceRange.minVariantPrice}
            </p>
          )}
          {product.inventory <= 5 && product.inventory > 0 && (
            <span className='text-sm text-red-500 font-medium'>
              Only {product.inventory} left!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
