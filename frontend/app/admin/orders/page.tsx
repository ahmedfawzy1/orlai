'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';
import { Skeleton } from '@/app/components/ui/skeleton';
import { axiosInstance } from '@/app/lib/axios';
import type { Order } from '@/app/store/useOrderStore';
import { toast } from 'react-hot-toast';
import OrderDetailsModal from '@/app/components/Admin/Orders/OrderDetailsModal';

type OrderStatus = Order['orderStatus'] | 'all';

const ORDER_STATUS = [
  { value: 'all' as const, label: 'All' },
  { value: 'pending' as const, label: 'Pending' },
  { value: 'processing' as const, label: 'Processing' },
  { value: 'shipped' as const, label: 'Shipped' },
  { value: 'delivered' as const, label: 'Delivered' },
  { value: 'cancelled' as const, label: 'Cancelled' },
] as const;

const PAYMENT_METHODS = [
  { value: 'all', label: 'All' },
  { value: 'card', label: 'Card' },
  { value: 'cod', label: 'Cash on Delivery' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus>('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(search && { search }),
        ...(status && status !== 'all' && { status }),
        ...(paymentMethod && paymentMethod !== 'all' && { paymentMethod }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        page,
        limit,
      };
      const res = await axiosInstance.get('/orders/admin/all', { params });
      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [search, status, paymentMethod, startDate, endDate, page]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    if (newStatus === 'all') return;
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className='px-4 pt-6 space-y-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold'>Orders</h1>
      <Card className='p-4 shadow-lg rounded-xl bg-white'>
        <form
          className='flex flex-col gap-6'
          onSubmit={e => {
            e.preventDefault();
            setPage(1);
            fetchOrders();
          }}
        >
          {/* First row */}
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className='flex flex-col w-full'>
              <label className='mb-1 text-xs font-medium text-muted-foreground'>
                Search Orders
              </label>
              <Input
                placeholder='Search by ID, name, or email...'
                className='w-full rounded-lg border-gray-300 transition'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className='flex flex-col w-full md:w-36'>
              <label className='mb-1 text-xs font-medium text-muted-foreground'>
                Order Status
              </label>
              <Select
                value={status}
                onValueChange={(value: OrderStatus) => setStatus(value)}
              >
                <SelectTrigger className='w-full md:w-36 rounded-lg border-gray-300 transition'>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.value === 'all' ? 'Status' : s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col w-full md:w-36'>
              <label className='mb-1 text-xs font-medium text-muted-foreground'>
                Payment Method
              </label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className='w-full md:w-36 rounded-lg border-gray-300 transition'>
                  <SelectValue placeholder='All Payment Methods' />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.value === 'all' ? 'Payment Methods' : m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-end gap-4 w-full md:w-auto'>
              <Button
                type='submit'
                className='w-full md:w-auto h-9 bg-primary hover:bg-primary/80 rounded-lg shadow transition'
              >
                Filter
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='w-full md:w-auto h-9 rounded-lg border border-gray-300 hover:bg-gray-100 transition'
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setPaymentMethod('all');
                  setStartDate('');
                  setEndDate('');
                  setPage(1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          {/* Second row */}
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className='flex flex-col w-full md:w-1/2'>
              <label className='mb-1 text-sm font-medium text-muted-foreground'>
                Start date
              </label>
              <Input
                type='date'
                placeholder='Pick a date'
                className='w-full rounded-lg border-gray-300 transition'
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
              <label className='mb-1 text-sm font-medium text-muted-foreground'>
                End date
              </label>
              <Input
                type='date'
                placeholder='Pick a date'
                className='w-full rounded-lg border-gray-300 transition'
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Card>
      <Card className='p-0 shadow-lg rounded-xl bg-white'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-100'>
              <TableHead className='font-bold text-gray-700'>
                INVOICE NO
              </TableHead>
              <TableHead className='font-bold text-gray-700'>
                ORDER TIME
              </TableHead>
              <TableHead className='font-bold text-gray-700'>
                CUSTOMER NAME
              </TableHead>
              <TableHead className='font-bold text-gray-700'>METHOD</TableHead>
              <TableHead className='font-bold text-gray-700'>AMOUNT</TableHead>
              <TableHead className='font-bold text-gray-700'>STATUS</TableHead>
              <TableHead className='font-bold text-gray-700'>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <TableRow key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                  {Array(7)
                    .fill(0)
                    .map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className='h-6 w-full' />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-red-500'>
                  {error}
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center'>
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, idx) => (
                <TableRow
                  key={order._id}
                  className={`transition hover:bg-primary/10 ${
                    idx % 2 === 0 ? 'bg-gray-50' : ''
                  }`}
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                  <TableCell>{order._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {order.shippingAddress?.name ||
                      order.customer?.first_name +
                        ' ' +
                        order.customer?.last_name}
                  </TableCell>
                  <TableCell>
                    {order.paymentMethod === 'card'
                      ? 'Card'
                      : 'Cash on Delivery'}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onValueChange={(value: OrderStatus) =>
                        handleStatusChange(order._id, value)
                      }
                    >
                      <SelectTrigger className='w-32 rounded-lg border-gray-300 transition'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUS.map(s => (
                          <SelectItem
                            key={s.value}
                            value={s.value}
                            className='transition hover:bg-primary/10'
                          >
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      size='sm'
                      variant='secondary'
                      className='rounded-lg border border-gray-300 hover:bg-gray-100 transition'
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        <div className='flex justify-center items-center gap-4 p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl'>
          <Button
            variant='secondary'
            disabled={page === 1}
            className='rounded-lg'
            onClick={() => setPage(page - 1)}
          >
            &larr; Previous
          </Button>
          <span className='font-medium text-gray-700'>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='secondary'
            disabled={page === totalPages}
            className='rounded-lg'
            onClick={() => setPage(page + 1)}
          >
            Next &rarr;
          </Button>
        </div>
      </Card>
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
