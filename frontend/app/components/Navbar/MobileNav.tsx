'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/app/store/useCartStore';
import { useProductStore } from '@/app/store/useProductStore';
import { MenuItem } from './menuConfig';
import { Menu, Heart, ShoppingBag, X, Search, Trash2 } from 'lucide-react';
import { icons } from './icons';
import { Product } from '@/app/types/product';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/app/components/ui/sheet';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
interface MobileNavProps {
  menuItems: MenuItem[];
  logo: {
    url: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  auth: {
    login: { title: string; url: string };
  };
}

const MobileNav = ({ menuItems, logo, auth }: MobileNavProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();
  const { data: session } = useSession();
  const { items, removeFromCart, getCart } = useCartStore();
  const { products, init } = useProductStore();

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

  const handleProductClick = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('Please login to access this page');
      return;
    }
  };

  const handleMenuLinkClick = () => {
    setMenuOpen(false);
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
    <div className='block px-4 lg:hidden'>
      <div className='flex items-center justify-between'>
        <Link href={logo.url} className='flex items-center gap-2'>
          <Image
            width={logo.width}
            height={logo.height}
            src={logo.src}
            className='max-h-8'
            alt={logo.alt}
            priority
          />
        </Link>
        <div className='flex items-center gap-2'>
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
                    <div className='grid grid-cols-1 gap-4'>
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
            onClick={handleNavigation}
            href={'/wishlist'}
            aria-label='Wishlist'
          >
            <Heart size={22} strokeWidth={1.5} />
          </Link>
          <Sheet open={cartMenuOpen} onOpenChange={setCartMenuOpen}>
            <SheetTrigger asChild>
              <button aria-label='Cart' className='h-fit cursor-pointer'>
                <ShoppingBag size={22} strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[350px] max-w-full p-0'>
              <div className='p-6 flex flex-col h-full'>
                <div className='mb-4'>
                  <div className='text-lg font-medium mb-2'>
                    You have {items.length} item{items.length !== 1 ? 's' : ''}{' '}
                    in your cart
                  </div>
                </div>
                <div className='flex-1 space-y-4 overflow-y-auto mb-4'>
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
                              {item.product.priceRange.minVariantPrice.toFixed(
                                2,
                              )}
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
                  <SheetClose asChild>
                    <Link
                      href='/cart'
                      className='w-full border border-black rounded-md py-2 mb-2 font-medium hover:bg-gray-100 transition block text-center'
                      onClick={() => setCartMenuOpen(false)}
                    >
                      View Cart
                    </Link>
                  </SheetClose>
                  <button
                    onClick={handleCheckout}
                    className='w-full bg-black text-white rounded-md py-2 font-medium hover:bg-gray-900 transition cursor-pointer'
                    disabled={items.length === 0}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                className='w-6 hover:bg-transparent'
                variant='ghost'
                size='icon'
                aria-label='Menu'
              >
                <Menu className='size-5' />
              </Button>
            </SheetTrigger>
            <SheetContent className='overflow-y-auto'>
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href={logo.url}
                    className='flex items-center gap-2'
                    onClick={handleMenuLinkClick}
                  >
                    <Image
                      width={logo.width}
                      height={logo.height}
                      src={logo.src}
                      className='max-h-8'
                      alt={logo.alt}
                      priority
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-6 p-4'>
                <Accordion
                  type='single'
                  collapsible
                  className='flex w-full flex-col gap-4'
                >
                  {menuItems.map(item =>
                    renderMobileMenuItem(item, handleMenuLinkClick),
                  )}
                </Accordion>
                <div className='flex flex-col gap-3'>
                  {session?.user ? (
                    <>
                      <Link
                        href='/profile'
                        className='w-full'
                        onClick={handleMenuLinkClick}
                      >
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full py-[18px] cursor-pointer'
                        >
                          Profile
                        </Button>
                      </Link>
                      {session.user.role === 'admin' && (
                        <Link
                          href='/admin'
                          className='w-full'
                          onClick={handleMenuLinkClick}
                        >
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full py-[18px] cursor-pointer'
                          >
                            Admin
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant='default'
                        size='sm'
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className='py-[18px] cursor-pointer'
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant='outline'>
                        <Link
                          href={auth.login.url}
                          onClick={handleMenuLinkClick}
                        >
                          {auth.login.title}
                        </Link>
                      </Button>
                      <Button asChild variant='default'>
                        <Link href={'/sign-up'} onClick={handleMenuLinkClick}>
                          Sign up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

const renderMobileMenuItem = (item: MenuItem, onLinkClick: () => void) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className='border-b-0'>
        <AccordionTrigger className='text-md py-0 font-semibold hover:no-underline'>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map(subItem => (
            <SubMenuLink
              key={subItem.title}
              item={subItem}
              onLinkClick={onLinkClick}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      className='text-md font-semibold'
      onClick={onLinkClick}
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({
  item,
  onLinkClick,
}: {
  item: MenuItem;
  onLinkClick: () => void;
}) => {
  return (
    <Link
      className='flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground'
      href={item.url}
      onClick={onLinkClick}
    >
      <div className='text-foreground'>{item.icon && icons[item.icon]}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-sm leading-snug text-muted-foreground'>
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MobileNav;
