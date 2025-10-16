'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { getChartData, type ChartData } from '@/app/lib/dashboard';

export default function DashboardCharts() {
  const [tab, setTab] = useState<'sales' | 'orders'>('sales');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const data = await getChartData();
        setChartData(data);
      } catch (err) {
        setError('Failed to load chart data');
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const lineChartData = chartData?.weeklyData || [];
  const dataKey = tab === 'sales' ? 'sales' : 'orders';
  const chartColor = tab === 'sales' ? '#10b981' : '#2563eb';
  const bestSellingProducts = chartData?.bestSellingProducts || [];

  if (loading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <Card className='shadow-sm animate-pulse'>
          <CardHeader>
            <div className='w-32 h-6 bg-gray-200 rounded'></div>
          </CardHeader>
          <CardContent className='px-4'>
            <div className='flex gap-6 border-b mb-2'>
              <div className='w-12 h-8 bg-gray-200 rounded'></div>
              <div className='w-16 h-8 bg-gray-200 rounded'></div>
            </div>
            <div className='bg-gray-50 rounded-lg p-2 h-[220px]'></div>
          </CardContent>
        </Card>
        <Card className='shadow-sm animate-pulse'>
          <CardHeader>
            <div className='w-40 h-6 bg-gray-200 rounded'></div>
          </CardHeader>
          <CardContent>
            <div className='h-[220px] bg-gray-50 rounded'></div>
            <div className='flex flex-wrap gap-3 mt-4'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className='w-24 h-4 bg-gray-200 rounded'></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <Card className='shadow-sm border-red-200 bg-red-50'>
          <CardHeader>
            <CardTitle className='text-lg font-bold text-red-600'>
              Chart Error
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4'>
            <div className='text-red-600 text-center py-8'>
              <div className='text-lg font-medium mb-2'>
                Error Loading Chart Data
              </div>
              <div className='text-sm'>{error}</div>
            </div>
          </CardContent>
        </Card>
        <Card className='shadow-sm border-red-200 bg-red-50'>
          <CardHeader>
            <CardTitle className='text-lg font-bold text-red-600'>
              Products Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-red-600 text-center py-8'>
              <div className='text-lg font-medium mb-2'>
                Error Loading Products Data
              </div>
              <div className='text-sm'>{error}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-lg font-bold'>Weekly Sales</CardTitle>
        </CardHeader>
        <CardContent className='px-4'>
          <div className='flex gap-6 border-b mb-2'>
            <button
              className={`py-2 px-4 border-b-2 transition-colors duration-150 ${
                tab === 'sales'
                  ? 'border-emerald-500 text-emerald-600 font-semibold'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setTab('sales')}
            >
              Sales
            </button>
            <button
              className={`py-2 px-4 border-b-2 transition-colors duration-150 ${
                tab === 'orders'
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setTab('orders')}
            >
              Orders
            </button>
          </div>
          <div className='bg-gray-50 rounded-lg p-2'>
            <ResponsiveContainer width='100%' height={220}>
              <LineChart data={lineChartData}>
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey={dataKey}
                  stroke={chartColor}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-lg font-bold'>
            Best Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie
                data={bestSellingProducts}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={80}
                label
              >
                {bestSellingProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className='flex flex-wrap gap-3 mt-4'>
            {bestSellingProducts.map(item => (
              <span key={item.name} className='flex items-center gap-2 text-sm'>
                <span
                  className='inline-block w-3 h-3 rounded-full'
                  style={{ background: item.color }}
                ></span>
                {item.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
