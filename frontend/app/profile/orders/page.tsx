'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { useOrderStore } from '@/app/store/useOrderStore';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';

export default function OrdersPage() {
  const { orders, fetchOrders, cancelOrder } = useOrderStore();
  const [search, setSearch] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState<
    string | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (orderId: string) => {
    router.push(`/profile/orders/${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    await cancelOrder(orderId);
    setCancellingId(null);
    setConfirmDialogOpen(false);
    setPendingCancelOrderId(null);
  };

  const openCancelDialog = (orderId: string) => {
    setPendingCancelOrderId(orderId);
    setConfirmDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setConfirmDialogOpen(false);
    setPendingCancelOrderId(null);
  };

  return (
    <div className='py-8 px-2 md:px-0'>
      {/* Search and Filter */}
      <div className='flex flex-col md:flex-row items-center gap-3 mb-8'>
        <div className='flex-1 w-full'>
          <div className='relative w-full'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'>
              <Search className='size-5' />
            </span>
            <Input
              placeholder='Search'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-6 rounded-md border !border-zinc-200 bg-white text-zinc-500 placeholder:text-zinc-400 !ring-0'
            />
          </div>
        </div>
        <button className='flex gap-2 items-center bg-zinc-900 hover:bg-zinc-800 text-white rounded-md px-6 py-3 shadow-none cursor-pointer'>
          <Filter className='size-5' />
          Filter
        </button>
      </div>
      {/* Filter orders by product name */}
      <div className='flex flex-col gap-4'>
        {orders
          .filter(order =>
            order.items.some(item =>
              item.product.name.toLowerCase().includes(search.toLowerCase()),
            ),
          )
          .map(order => (
            <div
              key={order._id}
              className={`flex flex-col md:flex-row justify-between items-center gap-4 p-4 pb-8 border-b ${
                order._id === String(orders.length) ? 'border-b-0' : ''
              }`}
            >
              <div className='flex flex-col gap-3'>
                <div className='flex flex-row items-center gap-4'>
                  <div className='w-20 h-20 relative rounded-xs overflow-hidden bg-white'>
                    <Image
                      src={order.items[0].product.images[0]}
                      alt={order.items[0].product.name}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className='flex-1 flex flex-col gap-2'>
                    <div className='flex flex-col md:flex-row md:items-center md:gap-4 justify-between'>
                      <div>
                        <Link
                          href={`/shop/${order.items[0].product.slug}`}
                          className='font-semibold text-base md:text-lg max-w-[225px] text-ellipsis block overflow-hidden whitespace-nowrap'
                        >
                          {order.items[0].product.name}
                        </Link>
                        <div className='text-sm text-muted-foreground'>
                          Size: {order.items[0].size.name}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          Qty: 1
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <div
                    className={`w-fit px-3 py-1 rounded-xs text-xs font-medium ${
                      order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.orderStatus}
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    Your order is has been {order.orderStatus}
                  </span>
                </div>
                <div className='flex items-center gap-2 mt-1'>
                  <div
                    className={`w-fit px-3 py-1 rounded-xs text-xs font-medium ${
                      order.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    Payment: {order.paymentStatus}
                  </div>
                  <div
                    className={`w-fit px-3 py-1 rounded-xs text-xs font-medium bg-gray-100 text-gray-700`}
                  >
                    Method:{' '}
                    {order.paymentMethod === 'card'
                      ? 'Card'
                      : 'Cash on Delivery'}
                  </div>
                </div>
              </div>
              <div className='font-bold text-lg mt-2 md:mt-0'>
                $
                {order.items[0].product.priceRange?.[0]?.minVariantPrice?.toFixed(
                  2,
                ) ?? '0.00'}
              </div>

              <div className='flex flex-col gap-2 w-full md:w-auto md:flex-col md:items-end'>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => handleViewOrder(order._id)}
                >
                  View Order
                </Button>

                {order.orderStatus === 'delivered' &&
                  !order.items[0].hasReviewed && (
                    <Button
                      className='w-full mt-1'
                      onClick={() =>
                        router.push(`/shop/${order.items[0].product.slug}`)
                      }
                    >
                      Write a Review
                    </Button>
                  )}

                {order.orderStatus !== 'delivered' &&
                  order.orderStatus !== 'cancelled' && (
                    <Button
                      variant='destructive'
                      className='w-full mt-1'
                      disabled={cancellingId === order._id}
                      onClick={() => openCancelDialog(order._id)}
                    >
                      {cancellingId === order._id
                        ? 'Cancelling...'
                        : 'Cancel Order'}
                    </Button>
                  )}
              </div>
            </div>
          ))}
      </div>
      {/* Cancel Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to cancel this order?</p>
          <DialogFooter>
            <Button variant='outline' onClick={closeCancelDialog}>
              No, keep order
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                pendingCancelOrderId && handleCancelOrder(pendingCancelOrderId)
              }
              disabled={cancellingId === pendingCancelOrderId}
            >
              {cancellingId === pendingCancelOrderId
                ? 'Cancelling...'
                : 'Yes, cancel order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
