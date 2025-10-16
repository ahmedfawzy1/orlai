'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { useCartStore } from '../store/useCartStore';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function Client() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    delivery,
    discount,
    discountApplied,
    discountAmount,
    couponInfo,
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

  const handleApplyDiscount = async () => {
    await applyDiscount();
  };

  const handleCheckout = () => {
    if (!session?.user) {
      toast.error('Please login to proceed to checkout');
      return;
    }
    router.push('/checkout/address');
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product?.priceRange?.minVariantPrice || 0) * item.quantity,
    0,
  );

  let grandTotal = subtotal - discountAmount + delivery;
  if (grandTotal < 0) grandTotal = 0;

  if (loading && items.length === 0) {
    return (
      <div className='min-h-screen max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8'>
        <div className='mb-6 sm:mb-8'>
          <Skeleton className='h-8 w-48 mb-2' />
          <Skeleton className='h-4 w-64' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          <div className='lg:col-span-2'>
            <div className='mb-4'>
              <Skeleton className='h-6 w-32' />
            </div>
            <Card className='overflow-hidden'>
              <div className='divide-y divide-gray-200'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='p-4 sm:p-6'>
                    <div className='flex items-start gap-4'>
                      <Skeleton className='w-20 h-20 rounded-lg flex-shrink-0' />
                      <div className='flex-1 space-y-2'>
                        <Skeleton className='h-4 w-3/4' />
                        <Skeleton className='h-3 w-1/2' />
                        <div className='flex justify-between items-center mt-3'>
                          <Skeleton className='h-4 w-16' />
                          <Skeleton className='h-8 w-24 rounded-lg' />
                        </div>
                        <div className='flex justify-between items-center pt-3 border-t border-gray-100'>
                          <Skeleton className='h-3 w-12' />
                          <Skeleton className='h-4 w-16' />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className='lg:col-span-1'>
            <Card className='shadow-lg'>
              <CardContent className='p-4 sm:p-6'>
                <Skeleton className='h-6 w-32 mb-4' />
                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-4 w-12' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <div className='flex'>
                      <Skeleton className='h-10 flex-1 rounded-r-none' />
                      <Skeleton className='h-10 w-16 rounded-l-none' />
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-12' />
                  </div>
                </div>
                <div className='border-t border-gray-200 pt-4 mb-6'>
                  <div className='flex justify-between'>
                    <Skeleton className='h-5 w-12' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                </div>
                <Skeleton className='w-full h-12 rounded-lg' />
                <Skeleton className='h-3 w-40 mx-auto mt-3' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className='min-h-screen max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8'>
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
            Checkout
          </h1>
          <p className='text-sm sm:text-base text-gray-600 mt-1'>
            Review your items and proceed to checkout
          </p>
        </div>

        <div className='flex flex-col items-center justify-center py-12 sm:py-16'>
          <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
            <svg
              className='w-12 h-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
              />
            </svg>
          </div>
          <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-2'>
            Your cart is empty
          </h2>
          <p className='text-gray-600 text-center mb-8 max-w-md'>
            Looks like you haven't added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <Button
            onClick={() => router.push('/shop')}
            className='px-8 py-3 text-base font-medium rounded-lg bg-gray-900 hover:bg-gray-800'
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className='text-center text-red-600'>{error}</p>;
  }

  return (
    <div className='min-h-screen max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8'>
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
          Checkout
        </h1>
        <p className='text-sm sm:text-base text-gray-600 mt-1'>
          Review your items and proceed to checkout
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
        {/* Products Section */}
        <div className='lg:col-span-2'>
          <div className='mb-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900'>
              Products ({items.length})
            </h2>
          </div>

          {/* Desktop Headers */}
          <div className='hidden lg:grid grid-cols-12 text-sm font-medium text-gray-500 mb-4 px-4'>
            <div className='col-span-5'>Product</div>
            <div className='col-span-2 text-center'>Price</div>
            <div className='col-span-2 text-center'>Quantity</div>
            <div className='col-span-2 text-right pe-1'>Subtotal</div>
            <div className='col-span-1 text-center'>Action</div>
          </div>

          <Card className='overflow-hidden py-3'>
            <div className='divide-y divide-gray-200'>
              {items.map(item => (
                <div key={item._id} className='p-4 sm:p-6 py-3'>
                  {/* Mobile Layout */}
                  <div className='lg:hidden space-y-4'>
                    <div className='flex items-start gap-4'>
                      <div className='w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50'>
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className='object-cover w-full h-full'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-gray-900 text-sm sm:text-base line-clamp-2'>
                          {item.product.name}
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-500 mt-1'>
                          Size {item.size.name} | Color {item.color.name}
                        </p>
                        <div className='flex items-center justify-between mt-3'>
                          <span className='text-sm sm:text-base font-medium text-gray-900'>
                            $
                            {item.product.priceRange.minVariantPrice.toFixed(2)}
                          </span>
                          <div className='flex items-center gap-2'>
                            <div className='flex items-center border border-gray-300 rounded-lg'>
                              <button
                                onClick={() => handleQuantity(item._id, -1)}
                                className='p-2 hover:bg-gray-50 transition-colors rounded-l-lg'
                              >
                                <Minus className='w-4 h-4' />
                              </button>
                              <span className='px-3 py-2 text-sm font-medium min-w-[3rem] text-center'>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantity(item._id, 1)}
                                className='p-2 hover:bg-gray-50 transition-colors rounded-r-lg'
                              >
                                <Plus className='w-4 h-4' />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                              aria-label='Remove item from cart'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </div>
                        <div className='flex justify-between items-center mt-3 pt-3 border-t border-gray-100'>
                          <span className='text-sm text-gray-600'>
                            Subtotal
                          </span>
                          <span className='font-semibold text-gray-900'>
                            $
                            {(
                              (item.product?.priceRange?.minVariantPrice || 0) *
                              item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className='hidden lg:grid grid-cols-12 items-center gap-4'>
                    <div className='col-span-5 flex items-center gap-4'>
                      <div className='w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50'>
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className='object-cover w-full h-full'
                        />
                      </div>
                      <div className='min-w-0'>
                        <h3 className='font-semibold text-gray-900 text-sm line-clamp-2'>
                          {item.product.name}
                        </h3>
                        <p className='text-xs text-gray-500 mt-1'>
                          Size {item.size.name} | Color {item.color.name}
                        </p>
                      </div>
                    </div>
                    <div className='col-span-2 text-center'>
                      <span className='text-sm font-medium text-gray-900'>
                        ${item.product.priceRange.minVariantPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className='col-span-2 flex justify-center'>
                      <div className='flex items-center border border-gray-300 rounded-lg'>
                        <button
                          onClick={() => handleQuantity(item._id, -1)}
                          className='p-2 hover:bg-gray-50 transition-colors rounded-l-lg'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <span className='px-3 py-2 text-sm font-medium min-w-[3rem] text-center'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantity(item._id, 1)}
                          className='p-2 hover:bg-gray-50 transition-colors rounded-r-lg'
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                    <div className='col-span-2 text-right'>
                      <span className='text-sm font-semibold text-gray-900'>
                        $
                        {(
                          (item.product?.priceRange?.minVariantPrice || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className='col-span-1 flex justify-center'>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                        aria-label='Remove item from cart'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='sticky top-6'>
            <Card className='shadow-lg py-2'>
              <CardContent className='p-4 sm:p-6 pb-2'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Order Summary
                </h3>

                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-medium text-gray-900'>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Discount Code
                    </label>
                    <div className='flex'>
                      <Input
                        placeholder='Enter code'
                        value={discount}
                        onChange={e => setDiscount(e.target.value)}
                        disabled={discountApplied}
                        className='rounded-r-none text-sm !ring-0 focus-visible:border-gray-300'
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={discountApplied || !discount}
                        className='rounded-l-none text-sm px-4'
                        size='sm'
                      >
                        {discountApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                    {discountApplied && couponInfo && (
                      <div className='text-green-600 text-xs'>
                        ✓ Coupon "{couponInfo.code}" applied: -$
                        {discountAmount.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Delivery</span>
                    <span className='font-medium text-gray-900'>
                      ${delivery.toFixed(2)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className='flex justify-between text-sm text-green-600'>
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className='border-t border-gray-200 pt-4 mb-6'>
                  <div className='flex justify-between text-base font-bold'>
                    <span className='text-gray-900'>Total</span>
                    <span className='text-gray-900'>
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className='w-full py-3 text-base font-medium rounded-lg bg-gray-900 hover:bg-gray-800'
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <p className='text-xs text-gray-500 text-center mt-3'>
                  Secure checkout with SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
