'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrderStore } from '@/app/store/useOrderStore';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { currentOrder, loading, error, fetchOrderDetails } = useOrderStore();

  useEffect(() => {
    if (orderId) fetchOrderDetails(orderId as string);
  }, [orderId, fetchOrderDetails]);

  if (loading) return <div className='p-8'>Loading order details...</div>;
  if (error) return <div className='p-8 text-red-500'>{error}</div>;
  if (!currentOrder) return <div className='p-8'>Order not found.</div>;

  const statusColorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  const statusColor =
    statusColorMap[currentOrder.orderStatus] || 'bg-gray-100 text-gray-800';

  return (
    <div className='max-w-3xl mx-auto py-10 px-4'>
      <Button variant='outline' className='mb-8' onClick={() => router.back()}>
        Back to Orders
      </Button>

      <div className='bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold mb-1'>
            Order #{currentOrder._id.slice(-6).toUpperCase()}
          </h1>
          <div className='text-sm text-muted-foreground'>
            Placed on: {new Date(currentOrder.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div
          className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
        >
          {currentOrder.orderStatus.charAt(0).toUpperCase() +
            currentOrder.orderStatus.slice(1)}
        </div>
      </div>

      <div className='bg-white rounded-xl shadow p-6 mb-8'>
        <div className='font-semibold text-lg mb-4'>Order Items</div>
        <div className='flex flex-col gap-6'>
          {currentOrder.items.map(item => (
            <div
              key={item.product._id + item.size.name + item.color.name}
              className='flex flex-col sm:flex-row items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0'
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                width={72}
                height={72}
                className='rounded-lg object-cover border'
              />
              <div className='flex-1 w-full'>
                <div className='font-semibold'>{item.product.name}</div>
                <div className='text-sm text-muted-foreground mb-1'>
                  Size: {item.size.name} | Color: {item.color.name}
                </div>
                <div className='text-sm text-muted-foreground'>
                  Qty: {item.quantity}
                </div>
              </div>
              <div className='font-bold text-lg'>${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-xl shadow p-5'>
          <div className='font-semibold mb-2 text-lg'>Shipping Address</div>
          <div>{currentOrder.shippingAddress.name}</div>
          <div>{currentOrder.shippingAddress.phone}</div>
          <div className='text-sm text-muted-foreground'>
            {currentOrder.shippingAddress.flatHouse},{' '}
            {currentOrder.shippingAddress.area},<br />
            {currentOrder.shippingAddress.city},{' '}
            {currentOrder.shippingAddress.state} -{' '}
            {currentOrder.shippingAddress.pinCode}
          </div>
        </div>

        <div className='bg-white rounded-xl shadow p-5'>
          <div className='font-semibold mb-2 text-lg'>Payment</div>
          <div className='mb-1'>
            Method:{' '}
            <span className='font-medium'>
              {currentOrder.paymentMethod === 'card'
                ? 'Card'
                : 'Cash on Delivery'}
            </span>
          </div>
          {currentOrder.paymentDetails && (
            <div className='mb-1 text-sm text-muted-foreground'>
              Card Type: {currentOrder.paymentDetails.cardType} <br />
              Last 4: {currentOrder.paymentDetails.last4}
            </div>
          )}
          <div className='text-sm'>
            Status:{' '}
            <span className='font-medium'>{currentOrder.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow p-6 flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <div className='font-semibold'>Total Amount:</div>
          <div className='font-bold text-lg'>
            ${currentOrder.totalAmount.toFixed(2)}
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='font-semibold'>Shipping Cost:</div>
          <div>${currentOrder.shippingCost.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
