'use client';

import { useSession } from 'next-auth/react';
import { useWishlistStore } from '@/app/store/useWishlistStore';
import { Product } from '@/app/types/product';
import ItemCard from '@/app/components/shop/ItemCard';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Wishlists() {
  const { data: session } = useSession();
  const { products, isLoading, error, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist(session.user.id);
    }
  }, [session?.user?.id, fetchWishlist]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-[50vh] text-red-500'>
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className='flex justify-center items-center min-h-[50vh] text-gray-500'>
        Your wishlist is empty
      </div>
    );
  }

  return (
    <div className='md:mb-6 flex-1 overflow-y-auto max-w-[100rem] mx-auto scrollbar-hide'>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-8'>
        {products.map((product: Product) => (
          <ItemCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
