import { useState } from 'react';
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

const weeklySales = [
  { name: 'May 10', sales: 400 },
  { name: 'May 9', sales: 300 },
  { name: 'May 8', sales: 150 },
  { name: 'May 7', sales: 230 },
  { name: 'May 6', sales: 200 },
  { name: 'May 5', sales: 270 },
  { name: 'May 4', sales: 700 },
];

const weeklyOrders = [
  { name: 'May 10', orders: 20 },
  { name: 'May 9', orders: 18 },
  { name: 'May 8', orders: 10 },
  { name: 'May 7', orders: 15 },
  { name: 'May 6', orders: 12 },
  { name: 'May 5', orders: 16 },
  { name: 'May 4', orders: 30 },
];

const bestSellingProducts = [
  { name: 'Green Leaf Lettuce', value: 400, color: '#34d399' },
  { name: 'Rainbow Chard', value: 300, color: '#2563eb' },
  { name: 'Clementine', value: 350, color: '#fb923c' },
  { name: 'Mint', value: 250, color: '#1e40af' },
];

export default function DashboardCharts() {
  const [tab, setTab] = useState<'sales' | 'orders'>('sales');
  const chartData = tab === 'sales' ? weeklySales : weeklyOrders;
  const dataKey = tab === 'sales' ? 'sales' : 'orders';
  const chartColor = tab === 'sales' ? '#10b981' : '#2563eb';

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
              <LineChart data={chartData}>
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
