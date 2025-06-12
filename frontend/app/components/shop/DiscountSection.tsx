'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { Card } from '../ui/card';
import { useCartStore } from '@/app/store/useCartStore';

interface DiscountSectionProps {
  className?: string;
}

export const DiscountSection: React.FC<DiscountSectionProps> = () => {
  const [discount, setDiscount] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  // const [successMsg, setSuccessMsg] = useState('');
  const { total: subtotal, delivery } = useCartStore();

  const handleApplyDiscount = () => {
    if (discountApplied) return;
    let discountAmount = 0;
    if (discount.trim().toUpperCase() === 'FLAT50') {
      discountAmount = 50;
    }
    if (discountAmount > 0) {
      setDiscountApplied(true);
      // setSuccessMsg('Discount applied!');
    } else {
      // setSuccessMsg('Invalid discount code.');
    }
  };

  const grandTotal = Math.max(0, subtotal + delivery);

  return (
    <div className='flex flex-col gap-4 sm:gap-6 w-full md:pt-16'>
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
        </CardContent>
      </Card>
    </div>
  );
};
