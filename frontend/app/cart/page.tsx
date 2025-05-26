'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function CartPage() {
  const {
    items,
    total,
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

  const grandTotal = total + delivery;

  if (items.length === 0) {
    return <p className='text-center text-gray-600'>Your cart is empty.</p>;
  }

  if (loading) {
    return <p className='text-center text-gray-600'>Loading cart...</p>;
  }

  if (error) {
    return <p className='text-center text-red-600'>{error}</p>;
  }

  return (
    <div className='min-h-screen bg-[#fafafa] py-10 px-2 md:px-10'>
      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 items-start gap-8'>
        <div className='md:col-span-2'>
          <div className='hidden md:grid grid-cols-12 text-sm font-semibold text-gray-500 mb-4 px-2'>
            <div className='col-span-6'>Products</div>
            <div className='col-span-2 text-center'>Price</div>
            <div className='col-span-2 text-center'>Quantity</div>
            <div className='col-span-2 text-right'>Subtotal</div>
          </div>
          <Card className='divide-y'>
            {items.map(item => (
              <div
                key={item._id}
                className='flex flex-col md:flex-row items-center gap-4 py-6 px-2 md:px-6'
              >
                <div className='flex items-center gap-4 flex-1 min-w-0'>
                  <div className='w-14 h-14 flex-shrink-0 flex items-center justify-center bg-white rounded-md border'>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={56}
                      height={56}
                      className='object-contain'
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
                <div className='w-20 text-center font-medium'>
                  ${item.product.priceRange.minVariantPrice.toFixed(2)}
                </div>
                <div className='flex items-center border rounded-md w-fit'>
                  <button
                    onClick={() => handleQuantity(item._id, -1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='px-4 py-2 min-w-[3rem] text-center'>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity(item._id, 1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
                <div className='w-20 text-right font-semibold'>
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

        <div className='flex flex-col gap-6'>
          <Card>
            <CardContent className='py-6'>
              <div className='flex justify-between mb-4'>
                <span className='font-semibold'>Subtotal</span>
                <span className='font-bold'>${total.toFixed(2)}</span>
              </div>
              <div className='mb-4'>
                <div className='text-xs text-gray-500 mb-1'>
                  Enter Discount Code
                </div>
                <div className='flex gap-2'>
                  <Input
                    placeholder='FLAT50'
                    value={discount}
                    onChange={e => setDiscount(e.target.value)}
                    disabled={discountApplied}
                    className='rounded-r-none'
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={discountApplied || !discount}
                    className='rounded-l-none'
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
              <div className='flex justify-between mb-2'>
                <span>Delivery Charge</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-lg font-bold mt-4'>
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <Button className='w-full mt-6 py-6 text-base font-normal rounded-lg'>
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
