'use client';

import { TableCell } from '@/app/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useEffect, useState } from 'react';
import {
  getRecentOrders,
  type RecentOrder,
  formatCurrency,
  formatDate,
} from '@/app/lib/dashboard';

export default function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getRecentOrders(10);
        setOrders(data);
      } catch (err) {
        setError('Failed to load recent orders');
        console.error('Error fetching recent orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='grid grid-cols-6 gap-4 py-3'>
                  <div className='w-16 h-4 bg-gray-200 rounded'></div>
                  <div className='w-24 h-4 bg-gray-200 rounded'></div>
                  <div className='w-32 h-4 bg-gray-200 rounded'></div>
                  <div className='w-20 h-4 bg-gray-200 rounded'></div>
                  <div className='w-16 h-4 bg-gray-200 rounded'></div>
                  <div className='w-20 h-4 bg-gray-200 rounded'></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='shadow-sm border-red-200 bg-red-50'>
        <CardHeader>
          <CardTitle className='text-red-600'>Recent Orders Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-red-600 text-center py-8'>
            <div className='text-lg font-medium mb-2'>
              Error Loading Recent Orders
            </div>
            <div className='text-sm'>{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <div className='text-lg font-medium mb-2'>No Recent Orders</div>
            <div className='text-sm'>No orders have been placed yet.</div>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-3 px-2 font-medium text-gray-700'>
                    Order ID
                  </th>
                  <th className='text-left py-3 px-2 font-medium text-gray-700'>
                    Customer
                  </th>
                  <th className='text-left py-3 px-2 font-medium text-gray-700'>
                    Products
                  </th>
                  <th className='text-left py-3 px-2 font-medium text-gray-700'>
                    Status
                  </th>
                  <th className='text-left py-3 px-2 font-medium text-gray-700'>
                    Amount
                  </th>
                  <th className='text-left py-3 px-2 font-medium text-gray-700'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className='border-b hover:bg-gray-50'>
                    <TableCell className='py-3 px-2'>
                      <div className='font-mono text-sm'>
                        {order.id.slice(-8)}
                      </div>
                    </TableCell>
                    <TableCell className='py-3 px-2'>
                      <div>
                        <div className='font-medium'>{order.customer}</div>
                        <div className='text-sm text-gray-500'>
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-3 px-2'>
                      <div className='max-w-xs'>
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className='text-sm'>
                            {item.quantity}x {item.product} ({item.size},{' '}
                            {item.color})
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className='text-sm text-gray-500'>
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='py-3 px-2'>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className='py-3 px-2 font-medium'>
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell className='py-3 px-2 text-sm text-gray-600'>
                      {formatDate(order.date)}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
