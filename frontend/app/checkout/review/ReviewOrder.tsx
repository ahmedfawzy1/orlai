'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/app/store/useCartStore';
import { useCheckoutStore } from '@/app/store/useCheckoutStore';
import { axiosInstance } from '@/app/lib/axios';

export default function ReviewOrder() {
  const { items, clearCart } = useCartStore();
  const { selectedAddress, paymentDetails, clearCheckout } = useCheckoutStore();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + item.product.priceRange.minVariantPrice * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedAddress || !paymentDetails) {
        throw new Error('Please complete shipping and payment details');
      }

      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size.name,
          color: item.color.name,
          price: item.product.priceRange.minVariantPrice,
        })),
        shippingAddress: selectedAddress,
        paymentMethod: paymentDetails.method,
        paymentDetails:
          paymentDetails.method === 'card'
            ? {
                stripePaymentMethodId: paymentDetails.paymentMethodId,
                cardType: paymentDetails.cardType,
                last4: paymentDetails.last4,
              }
            : null,
        totalAmount: calculateTotal(),
        shippingCost: 5,
      };

      const response = await axiosInstance.post('/orders', orderData);
      const data = response.data;

      if (!response.status) {
        throw new Error(data.error || 'Failed to create order');
      }

      setShowDialog(true);
    } catch (err: any) {
      setError(err.response.data.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = () => {
    router.push('/checkout/address');
  };

  const handleEditPayment = () => {
    router.push('/checkout/payment');
  };

  return (
    <div>
      {error && (
        <div className='mb-4 p-4 bg-red-50 text-red-600 rounded-md'>
          {error}
        </div>
      )}
      <div className='mb-8'>
        <div className='mb-4'>
          <span className='text-lg font-semibold'>
            Estimated delivery:{' '}
            {new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </span>
        </div>
        <Card className='mb-6'>
          <CardContent className='py-4 flex flex-col gap-4'>
            {items.map(item => (
              <div key={item._id} className='flex items-center gap-4'>
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className='w-14 h-14 object-contain rounded'
                  width={56}
                  height={56}
                />
                <div className='flex-1'>
                  <div className='font-semibold'>{item.product.name}</div>
                  <div className='text-xs text-gray-500'>
                    ${item.product.priceRange.minVariantPrice.toFixed(2)} |
                    Size: {item.size.name} | Color: {item.color.name}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className='mb-4'>
          <CardContent className='py-4 flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-semibold'>Shipping Address</span>
              <Button variant='outline' size='sm' onClick={handleEditAddress}>
                Edit
              </Button>
            </div>
            {selectedAddress ? (
              <>
                <div className='text-sm font-semibold'>
                  {selectedAddress.name}
                </div>
                <div className='text-xs text-gray-600'>
                  {`${selectedAddress.flatHouse}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pinCode}`}
                </div>
              </>
            ) : (
              <div className='text-red-500'>No address selected</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className='py-4 flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-semibold'>Payment Method</span>
              <Button variant='outline' size='sm' onClick={handleEditPayment}>
                Edit
              </Button>
            </div>
            {paymentDetails ? (
              <div className='text-sm'>
                {paymentDetails.method === 'card' ? (
                  <>
                    <div className='capitalize'>{paymentDetails.cardType}</div>
                    <div>Card ending in {paymentDetails.last4}</div>
                  </>
                ) : (
                  <div>Cash on Delivery</div>
                )}
              </div>
            ) : (
              <div className='text-red-500'>No payment method selected</div>
            )}
          </CardContent>
        </Card>
      </div>
      <Button
        className='w-full max-w-xs'
        onClick={handlePlaceOrder}
        disabled={!selectedAddress || !paymentDetails || loading}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className='sm:max-w-md p-8'>
          <div className='flex flex-col items-center'>
            <div className='flex items-center justify-center mb-6'>
              <div className='rounded-full bg-[#ededed] w-24 h-24 flex items-center justify-center'>
                <div className='rounded-full bg-[#d6d6d6] w-19 h-19 flex items-center justify-center'>
                  <div className='rounded-full bg-black w-14 h-14 flex items-center justify-center'>
                    <ShoppingBag size={20} className='text-white' />
                  </div>
                </div>
              </div>
            </div>
            <DialogHeader className='w-full items-center'>
              <DialogTitle className='text-center text-2xl font-bold mb-2'>
                Your order is confirmed
              </DialogTitle>
              <DialogDescription className='text-center text-base text-gray-700 mb-6'>
                Thanks for shopping! your order hasn't shipped yet,
                <br />
                but we will send you an email when it done.
              </DialogDescription>
            </DialogHeader>
            <div className='w-full flex flex-col gap-3'>
              <Button
                className='w-full bg-black text-white hover:bg-black/90 transition duration-300 text-sm font-normal rounded-lg py-6'
                onClick={() => {
                  clearCart();
                  clearCheckout();
                  setShowDialog(false);
                  router.push('/profile/orders');
                }}
              >
                View Order
              </Button>
              <Button
                variant='outline'
                className='w-full border-black text-black text-sm font-normal rounded-lg py-6 bg-white duration-300'
                onClick={() => {
                  clearCart();
                  clearCheckout();
                  setShowDialog(false);
                  router.push('/');
                }}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
