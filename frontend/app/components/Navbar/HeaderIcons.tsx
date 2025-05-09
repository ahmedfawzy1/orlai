'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Search, ShoppingBag, X } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/app/store/useAuthStore';

const HeaderIcons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { authUser } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!authUser) {
      toast.error('Please login to access this page');
      return;
    }
  };

  return (
    <div className='flex items-center gap-3'>
      <Sheet>
        <SheetTrigger asChild>
          <button aria-label='Search' className='h-fit cursor-pointer'>
            <Search size={22} strokeWidth={1.5} />
          </button>
        </SheetTrigger>
        <SheetContent side='top' className='w-full'>
          <SheetHeader className='px-4 py-2'>
            <SheetTitle>Search</SheetTitle>
            <form onSubmit={handleSearch} className='mt-2'>
              <div className='relative'>
                <Input
                  type='text'
                  placeholder='Search for products...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='w-full !ring-0'
                />
                {searchQuery && (
                  <button
                    type='button'
                    onClick={() => setSearchQuery('')}
                    className='absolute right-2 top-1/2 -translate-y-1/2'
                    aria-label='Clear search'
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Link onClick={handleNavigation} href={'/wishlist'} aria-label='Wishlist'>
        <Heart size={22} strokeWidth={1.5} />
      </Link>
      <Link onClick={handleNavigation} href={'/cart'} aria-label='Cart'>
        <ShoppingBag size={22} strokeWidth={1.5} />
      </Link>
    </div>
  );
};

export default HeaderIcons;
