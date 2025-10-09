'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Search, ShoppingBag, Trash2, X } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/app/store/useCartStore';
import { useProductStore } from '@/app/store/useProductStore';
import { Product } from '@/app/types/product';

const HeaderIcons = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { items, removeFromCart, getCart } = useCartStore();
  const { data: session } = useSession();
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { products, init } = useProductStore();
  const [searchOpen, setSearchOpen] = useState(false);

  // Initialize products when component mounts
  useEffect(() => {
    if (products.length === 0) {
      init();
    }
  }, [init, products.length]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    if (cartMenuOpen && session?.user) {
      getCart();
    }
  }, [cartMenuOpen, session?.user, getCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleNavigation = () => {
    if (!session?.user) {
      toast.error('Please login to access this page');
      return;
    }
  };

  const handleProductClick = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleCheckout = () => {
    if (!session?.user) {
      toast.error('Please login to proceed to checkout');
      return;
    }
    setCartMenuOpen(false);
    router.push('/checkout/address');
  };

  return (
    <div className='flex items-center gap-3'>
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
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
            {searchResults.length > 0 && (
              <div className='mt-4 max-h-[60vh] overflow-y-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {searchResults.map(product => (
                    <Link
                      key={product._id}
                      href={`/shop/${product.slug}`}
                      className='flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md'
                      onClick={handleProductClick}
                    >
                      <Image
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        width={50}
                        height={50}
                        className='object-cover rounded-md'
                      />
                      <div>
                        <h3 className='font-medium'>{product.name}</h3>
                        <p className='text-sm text-gray-600'>
                          ${product.priceRange.minVariantPrice.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className='mt-4 text-center text-gray-500'>
                No products found matching "{searchQuery}"
              </div>
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Link
        className='focus-visible:outline-none'
        onClick={handleNavigation}
        href={'/wishlist'}
        aria-label='Wishlist'
      >
        <Heart size={22} strokeWidth={1.5} />
      </Link>

      <div className='hidden lg:block'>
        <DropdownMenu open={cartMenuOpen} onOpenChange={setCartMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              aria-label='Cart'
              className='h-fit cursor-pointer focus-visible:outline-none'
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            side='bottom'
            className='w-[350px] max-w-full p-0'
          >
            <div className='p-6 flex flex-col h-full'>
              <div className='mb-4'>
                <div className='text-lg font-medium mb-2'>
                  You have {items.length} item{items.length !== 1 ? 's' : ''} in
                  your cart
                </div>
              </div>
              <div className='flex-1 space-y-4 overflow-y-auto mb-4 max-h-80 scrollbar-hide'>
                {items.length === 0 ? (
                  <div className='text-center text-gray-500'>
                    Your cart is empty.
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={item._id}
                      className={`flex items-center gap-3 border-b pb-4 ${
                        index === items.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <Image
                        src={item.product.images[0] || '/placeholder.png'}
                        alt={item.product.name}
                        className='w-16 h-16 object-cover'
                        width={56}
                        height={56}
                      />
                      <div className='flex-1'>
                        <div className='font-medium'>{item.product.name}</div>
                        <div className='text-sm'>
                          {item.quantity} x{' '}
                          <span className='font-semibold'>
                            $
                            {item.product.priceRange.minVariantPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className='text-xs text-gray-500'>
                          Size: {item.size.name}
                        </div>
                      </div>
                      <button
                        aria-label='Remove item'
                        className='text-red-500 hover:text-red-700 cursor-pointer'
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className='border-t pt-4'>
                <div className='flex justify-between font-semibold text-lg mb-4'>
                  <span>Subtotal</span>
                  <span>
                    $
                    {items
                      .reduce(
                        (sum, item) =>
                          sum +
                          (item.product?.priceRange?.minVariantPrice || 0) *
                            item.quantity,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <Link
                  href='/cart'
                  className='w-full border border-black rounded-md py-2 mb-2 font-medium hover:bg-gray-100 block transition text-center'
                  onClick={() => setCartMenuOpen(false)}
                >
                  View Cart
                </Link>
                <button
                  onClick={handleCheckout}
                  className='w-full bg-black text-white rounded-md py-2 font-medium hover:bg-gray-900 transition cursor-pointer'
                >
                  Checkout
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HeaderIcons;
