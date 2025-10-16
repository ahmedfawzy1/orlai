'use client';

import { Card } from '@/app/components/ui/card';
import { Layers, RefreshCw, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getSalesOverview,
  formatCurrency,
  type SalesOverview,
} from '@/app/lib/dashboard';

export default function SalesOverview() {
  const [salesData, setSalesData] = useState<SalesOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const data = await getSalesOverview();
        setSalesData(data);
      } catch (err) {
        setError('Failed to load sales data');
        console.error('Error fetching sales data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const summaryCards = [
    {
      title: 'Today Orders',
      value: salesData ? formatCurrency(salesData.today) : '$0.00',
      icon: <Layers className='w-8 h-8' />,
      color: 'bg-teal-600',
    },
    {
      title: 'Yesterday Orders',
      value: salesData ? formatCurrency(salesData.yesterday) : '$0.00',
      icon: <Layers className='w-8 h-8' />,
      color: 'bg-orange-400',
    },
    {
      title: 'This Month',
      value: salesData ? formatCurrency(salesData.thisMonth) : '$0.00',
      icon: <RefreshCw className='w-8 h-8' />,
      color: 'bg-blue-500',
    },
    {
      title: 'Last Month',
      value: salesData ? formatCurrency(salesData.lastMonth) : '$0.00',
      icon: <Calendar className='w-8 h-8' />,
      color: 'bg-cyan-700',
    },
    {
      title: 'All-Time Sales',
      value: salesData ? formatCurrency(salesData.allTime) : '$0.00',
      icon: <Calendar className='w-8 h-8' />,
      color: 'bg-emerald-700',
    },
  ];

  if (loading) {
    return (
      <div className='grid md:grid-cols-2 xl:grid-cols-5 gap-2 my-6'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            className='flex flex-col items-center justify-center h-[10rem] rounded-lg shadow-md p-0 border-0 bg-gray-200 animate-pulse'
          >
            <div className='flex flex-col items-center justify-center h-full w-full text-gray-400'>
              <div className='w-8 h-8 bg-gray-300 rounded mb-2'></div>
              <div className='w-20 h-4 bg-gray-300 rounded mb-1'></div>
              <div className='w-24 h-6 bg-gray-300 rounded'></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='grid md:grid-cols-2 xl:grid-cols-5 gap-2 my-6'>
        <Card className='col-span-full flex items-center justify-center h-[10rem] rounded-lg shadow-md border-red-200 bg-red-50'>
          <div className='text-red-600 text-center'>
            <div className='text-lg font-medium mb-2'>
              Error Loading Sales Data
            </div>
            <div className='text-sm'>{error}</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-5 gap-2 my-6'>
      {summaryCards.map(card => (
        <Card
          key={card.title}
          className={`flex flex-col items-center justify-center h-[10rem] rounded-lg shadow-md p-0 border-0 ${card.color}`}
        >
          <div className='flex flex-col items-center justify-center h-full w-full text-white'>
            <div className='mb-2'>{card.icon}</div>
            <div className='text-lg font-normal mb-1'>{card.title}</div>
            <div className='text-2xl font-bold'>{card.value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
