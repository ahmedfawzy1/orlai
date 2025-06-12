'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { useCartStore } from '../store/useCartStore';

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    delivery,
    discount,
    discountApplied,
    loading,
    error,
    setDiscount,
    applyDiscount,
    updateCart,
    getCart,
    removeFromCart,
  } = useCartStore();

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleQuantity = (itemId: string, change: number) => {
    const item = items.find(item => item._id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateCart(itemId, newQuantity);
    }
  };

  const handleApplyDiscount = () => {
    applyDiscount();
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product?.priceRange?.minVariantPrice || 0) * item.quantity,
    0
  );

  let discountAmount = 0;
  if (discountApplied) {
    if (discount === 'FLAT50') {
      discountAmount = 50;
    }
  }

  // Calculate grand total
  let grandTotal = subtotal - discountAmount + delivery;
  if (grandTotal < 0) grandTotal = 0;

  if (loading && items.length === 0) {
    return (
      <div className='min-h-screen max-w-[1280px] mx-auto py-10 px-2'>
        <h1 className='text-4xl font-semibold mb-8'>Checkout</h1>
        <p className='text-center text-gray-600 mb-4'>Your cart is empty.</p>
        <div className='w-full grid grid-cols-1 md:grid-cols-3 items-start gap-8'>
          <div className='md:col-span-2'>
            <Card className='divide-y'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='flex flex-col md:flex-row items-center gap-4 py-6 px-2 md:px-6'
                >
                  <Skeleton className='w-14 h-14 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <Skeleton className='h-5 w-32 mb-2' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                  <Skeleton className='w-20 h-6' />
                  <Skeleton className='w-28 h-10' />
                  <Skeleton className='w-20 h-6' />
                </div>
              ))}
            </Card>
          </div>
          <div className='flex flex-col gap-6'>
            <Card>
              <CardContent className='py-6'>
                <div className='flex justify-between mb-4'>
                  <Skeleton className='h-6 w-24' />
                  <Skeleton className='h-6 w-16' />
                </div>
                <div className='mb-4'>
                  <Skeleton className='h-4 w-32 mb-2' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='flex justify-between mb-2'>
                  <Skeleton className='h-5 w-24' />
                  <Skeleton className='h-5 w-12' />
                </div>
                <div className='flex justify-between text-lg font-bold mt-4'>
                  <Skeleton className='h-6 w-28' />
                  <Skeleton className='h-6 w-16' />
                </div>
                <Skeleton className='w-full h-12 mt-6 rounded-lg' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className='min-h-screen max-w-[1280px] mx-auto py-10 px-2'>
        <h1 className='text-4xl font-semibold mb-8'>Checkout</h1>
        <p className='text-center text-gray-600'>Your cart is empty.</p>
      </div>
    );
  }

  if (error) {
    return <p className='text-center text-red-600'>{error}</p>;
  }

  return (
    <div className='min-h-screen max-w-[1280px] mx-auto py-6 px-2'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-6 sm:mb-8'>
        Checkout
      </h1>
      <div className='w-full grid grid-cols-1 md:grid-cols-3 items-center gap-4 sm:gap-8'>
        <div className='md:col-span-2 w-full'>
          <div className='hidden md:grid grid-cols-12 text-xs sm:text-sm font-semibold text-gray-500 mb-2 sm:mb-4 px-1 sm:px-2'>
            <div className='col-span-6'>Products</div>
            <div className='col-span-2 text-center'>Price</div>
            <div className='col-span-2 text-center'>Quantity</div>
            <div className='col-span-2 text-right'>Subtotal</div>
          </div>
          <Card className='divide-y'>
            {items.map(item => (
              <div
                key={item._id}
                className='flex flex-row sm:flex-row items-center gap-3 sm:gap-4 py-4 sm:py-6 px-1 sm:px-6 w-full'
              >
                <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full'>
                  <div className='w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden'>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={56}
                      height={56}
                      className='object-contain w-full h-full'
                    />
                  </div>
                  <div className='min-w-0'>
                    <div className='font-semibold text-base truncate'>
                      {item.product.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Size {item.size.name} | Color {item.color.name}
                    </div>
                  </div>
                </div>
                <div className='w-fit text-center font-medium mt-2 sm:mt-0'>
                  ${item.product.priceRange.minVariantPrice.toFixed(2)}
                </div>
                <div className='flex items-center border rounded-md w-fit mt-2 sm:mt-0'>
                  <button
                    onClick={() => handleQuantity(item._id, -1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='px-1.5 md:px-4 py-2 text-center'>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity(item._id, 1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
                <div className='w-fit text-right font-semibold mt-2 sm:mt-0'>
                  $
                  {(
                    (item.product?.priceRange?.minVariantPrice || 0) *
                    item.quantity
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className='flex flex-col gap-4 sm:gap-6 w-full'>
          <Card>
            <CardContent className='py-4 sm:py-6'>
              <div className='flex justify-between mb-2 sm:mb-4 text-sm sm:text-base'>
                <span className='font-semibold'>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className='mb-2 sm:mb-4'>
                <div className='text-xs text-gray-500 mb-1'>
                  Enter Discount Code
                </div>
                <div className='flex'>
                  <Input
                    placeholder='FLAT50'
                    value={discount}
                    onChange={e => setDiscount(e.target.value)}
                    disabled={discountApplied}
                    className='rounded-r-none text-sm sm:text-base !ring-0 focus-visible:border-[#e5e5e5]'
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={discountApplied || !discount}
                    className='rounded-l-none text-sm sm:text-base px-3 sm:px-4'
                  >
                    {discountApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
                {discountApplied && (
                  <div className='text-green-600 text-xs mt-1'>
                    Discount applied!
                  </div>
                )}
              </div>
              <div className='flex justify-between mb-1 sm:mb-2 text-sm sm:text-base'>
                <span>Delivery Charge</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-base sm:text-lg font-bold mt-3 sm:mt-4'>
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <Button
                className='w-full mt-4 sm:mt-6 py-4 sm:py-6 text-base font-normal rounded-lg'
                onClick={() => router.push('/checkout/address')}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
