'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Filter, Search } from 'lucide-react';

const orders = [
  {
    id: '1',
    product: {
      name: 'Girls Pink Moana Printed Dress',
      size: 'S',
      image: '/images/category/category1.avif',
      price: 80,
    },
    status: 'Delivered',
    statusText: 'Delivered',
    description: 'Your product has been delivered',
  },
  {
    id: '2',
    product: {
      name: 'Women Textured Handheld Bag',
      size: 'Regular',
      image: '/images/category/category2.avif',
      price: 80,
    },
    status: 'In Process',
    statusText: 'In Process',
    description: 'Your product has been Inprocess',
  },
  {
    id: '3',
    product: {
      name: 'Tailored Cotton Casual Shirt',
      size: 'M',
      image: '/images/category/category3.avif',
      price: 40,
    },
    status: 'In Process',
    statusText: 'In Process',
    description: 'Your product has been Inprocess',
  },
];

export default function OrdersPage() {
  const [search, setSearch] = useState('');

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
            order.product.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(order => (
            <div
              key={order.id}
              className={`flex flex-col md:flex-row justify-between items-center gap-4 p-4 pb-8 border-b ${
                order.id === String(orders.length) ? 'border-b-0' : ''
              }`}
            >
              <div className='flex flex-col gap-3'>
                <div className='flex flex-row items-center gap-4'>
                  <div className='w-20 h-20 relative rounded-xs overflow-hidden bg-white'>
                    <Image
                      src={order.product.image}
                      alt={order.product.name}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className='flex-1 flex flex-col gap-2'>
                    <div className='flex flex-col md:flex-row md:items-center md:gap-4 justify-between'>
                      <div>
                        <Link
                          href={`/shop/${order.product.name}`}
                          className='font-semibold text-base md:text-lg max-w-[225px] text-ellipsis block overflow-hidden whitespace-nowrap'
                        >
                          {order.product.name}
                        </Link>
                        <div className='text-sm text-muted-foreground'>
                          Size: {order.product.size}
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
                      order.statusText === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.statusText}
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    {order.description}
                  </span>
                </div>
              </div>
              <div className='font-bold text-lg mt-2 md:mt-0'>
                ${order.product.price.toFixed(2)}
              </div>

              <div className='flex flex-col gap-2 w-full md:w-auto md:flex-col md:items-end'>
                <Button variant='outline' className='w-full'>
                  View Order
                </Button>
                <Button
                  variant={
                    order.status === 'Delivered' ? 'default' : 'destructive'
                  }
                  className='w-full mt-1'
                >
                  {order.status === 'Delivered'
                    ? 'Write A Review'
                    : 'Cancel Order'}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
