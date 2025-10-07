'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/app/types/product';
import { Heart, Eye, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useWishlistStore } from '@/app/store/useWishlistStore';
import { useCartStore } from '@/app/store/useCartStore';

export default function ItemCard({ product }: { product: Product }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useWishlistStore();
  const userId = session?.user?.id;

  const { addToCart } = useCartStore();

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error('Please login to add items to your wishlist');
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(userId, product._id);
        toast.success('Removed from your wishlist');
      } else {
        await addToWishlist(userId, product._id);
        toast.success('Added to your wishlist');
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error?.response?.data || error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.availableForSale || product.inventory === 0) {
      toast.error('Product is out of stock');
      return;
    }

    const variant = product.variants[0];
    const item = {
      _id: crypto.randomUUID(), // Local unique ID
      product,
      variantId: variant._id,
      color: variant.color
        ? {
            _id: variant.color._id,
            name: variant.color.name,
            hexCode: variant.color.hexCode,
          }
        : {
            _id: crypto.randomUUID(),
            name: 'Default',
            hexCode: '#000000',
          },
      size: {
        _id: variant.size._id,
        name: variant.size.name,
      },
      quantity: 1,
    };

    addToCart(item);
  };

  return (
    <div className='w-full h-full max-h-[25rem] rounded-xl flex flex-col items-center group'>
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
                isInWishlist(product._id) ? 'text-red-500' : 'text-gray-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={
                isInWishlist(product._id)
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
            >
              {isLoading ? (
                <Loader2 size={20} className='animate-spin' />
              ) : (
                <Heart
                  size={20}
                  fill={isInWishlist(product._id) ? 'red' : 'none'}
                />
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
          onClick={handleAddToCart}
          disabled={!product.availableForSale || product.inventory === 0}
          className='px-4 py-2 text-black text-lg font-medium text-center w-[calc(100%-2rem)] absolute bottom-5 left-1/2 z-30 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white rounded-lg hover:scale-105 hover:bg-gray-100 transition-all duration-300 transform-gpu cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label={
            product.availableForSale ? 'Add to cart' : 'Product unavailable'
          }
        >
          {product.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      <div className='w-full mt-4 space-y-2'>
        <Link
          href={`/shop/${product.slug}`}
          className='block hover:opacity-80 transition-opacity'
        >
          <h3 className='text-lg font-bold truncate'>{product.name}</h3>
        </Link>
        <p className='text-md text-black/70 font-medium'>
          {product.category?.name || 'Uncategorized'}
        </p>
        <div className='flex gap-2 items-center'>
          <p className='text-lg font-bold'>
            ${product.priceRange.maxVariantPrice}
          </p>
          {product.priceRange.minVariantPrice > 0 &&
            product.priceRange.minVariantPrice !==
              product.priceRange.maxVariantPrice && (
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
