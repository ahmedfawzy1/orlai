'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { ShoppingCart, RotateCcw, Truck, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getOrderStatusOverview, type OrderStatus } from '@/app/lib/dashboard';

export default function StatusOverview() {
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const data = await getOrderStatusOverview();
        setOrderData(data);
      } catch (err) {
        setError('Failed to load order data');
        console.error('Error fetching order data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const orderStatus = [
    {
      title: 'Total Orders',
      value: orderData?.total || 0,
      icon: <ShoppingCart className='w-5 h-5' />,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Orders Pending',
      value: orderData?.pending || 0,
      icon: <RotateCcw className='w-5 h-5' />,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Orders Processing',
      value: orderData?.processing || 0,
      icon: <Truck className='w-5 h-5' />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Orders Delivered',
      value: orderData?.delivered || 0,
      icon: <Check className='w-5 h-5' />,
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  if (loading) {
    return (
      <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className='shadow-sm animate-pulse'>
            <CardHeader className='flex flex-row items-center gap-3 pb-2'>
              <div className='rounded-full p-3 bg-gray-200 w-11 h-11'></div>
              <div className='flex flex-col flex-1'>
                <div className='w-20 h-4 bg-gray-200 rounded mb-2'></div>
                <div className='w-12 h-6 bg-gray-200 rounded'></div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-4'>
        <Card className='col-span-full shadow-sm border-red-200 bg-red-50'>
          <CardHeader className='flex items-center justify-center py-8'>
            <div className='text-red-600 text-center'>
              <div className='text-lg font-medium mb-2'>
                Error Loading Order Data
              </div>
              <div className='text-sm'>{error}</div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-4'>
      {orderStatus.map(status => (
        <Card key={status.title} className='shadow-sm'>
          <CardHeader className='flex flex-row items-center gap-3 pb-2'>
            <div className={`rounded-full p-3 ${status.color}`}>
              {status.icon}
            </div>
            <div className='flex flex-col'>
              <CardTitle className='text-sm font-medium'>
                {status.title}
              </CardTitle>
              <CardContent className='p-0'>
                <div className='text-xl font-bold'>{status.value}</div>
              </CardContent>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
