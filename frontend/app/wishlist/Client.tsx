'use client';

import React, { useEffect } from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useSession } from 'next-auth/react';
import ItemCard from '../components/shop/ItemCard';
import { Loader2 } from 'lucide-react';

export default function Client() {
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
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>My Wishlist</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {products.map(product => (
          <ItemCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
