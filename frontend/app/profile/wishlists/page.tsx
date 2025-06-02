'use client';

import { useAuthStore } from '@/app/store/useAuthStore';
import { getWishlistById } from '@/app/lib/wishlist';
import { Product } from '@/app/types/product';
import ItemCard from '@/app/components/shop/ItemCard';
import { useEffect, useState } from 'react';

export default function Wishlists() {
  const { authUser } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (authUser?._id) {
        const wishlist = await getWishlistById(authUser._id);
        setProducts(wishlist?.products || []);
      }
    };

    fetchWishlist();
  }, [authUser?._id]);

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
