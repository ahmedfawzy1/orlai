'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';
import { Checkbox } from '@/app/components/ui/checkbox';
import { toast } from 'react-hot-toast';
import { Skeleton } from '@/app/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { axiosInstance } from '@/app/lib/axios';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number | null;
  usedCount: number;
  createdAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minPurchase: 0,
    startDate: today,
    endDate: '',
    isActive: true,
    usageLimit: null as number | null,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/coupons');
      if (response.status !== 200) throw new Error('Failed to fetch coupons');
      const data = await response.data;
      setCoupons(data);
    } catch (error: any) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/coupons', newCoupon);
      if (response.status !== 201) {
        const error = await response.data;
        throw new Error(error.message || 'Failed to add coupon');
      }
      toast.success('Coupon added successfully');
      setIsAddDialogOpen(false);
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minPurchase: 0,
        startDate: today,
        endDate: '',
        isActive: true,
        usageLimit: null,
      });
      fetchCoupons();
    } catch (error: any) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data?.message || 'Failed to add coupon');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      const response = await axiosInstance.delete(`/coupons/${couponId}`);
      if (response.status !== 200) {
        const error = await response.data;
        throw new Error(error.message || 'Failed to delete coupon');
      }
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error: any) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedCoupons.map(id => handleDeleteCoupon(id)));
      setSelectedCoupons([]);
    } catch (error: any) {
      console.error(error.response?.data?.message);
      toast.error(
        error.response?.data?.message || 'Failed to delete selected coupons'
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCoupons(filteredCoupons.map(c => c._id));
    } else {
      setSelectedCoupons([]);
    }
  };

  const handleSelectCoupon = (couponId: string, checked: boolean) => {
    if (checked) {
      setSelectedCoupons(prev => [...prev, couponId]);
    } else {
      setSelectedCoupons(prev => prev.filter(id => id !== couponId));
    }
  };

  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    let result = [...coupons];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        coupon =>
          coupon.code.toLowerCase().includes(query) ||
          coupon.description.toLowerCase().includes(query)
      );
    }
    return result;
  }, [coupons, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const TableSkeleton = () => (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className='h-4 w-4' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-32' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-40' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-48' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className='px-4 pt-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Coupons</h1>
        <div className='flex gap-2'>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Coupon</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Coupon</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCoupon} className='space-y-4'>
                <Input
                  placeholder='Coupon Code'
                  value={newCoupon.code}
                  onChange={e =>
                    setNewCoupon({
                      ...newCoupon,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
                <Input
                  placeholder='Description'
                  value={newCoupon.description}
                  onChange={e =>
                    setNewCoupon({ ...newCoupon, description: e.target.value })
                  }
                  required
                />
                <Select
                  value={newCoupon.discountType}
                  onValueChange={value =>
                    setNewCoupon({
                      ...newCoupon,
                      discountType: value as 'percentage' | 'fixed',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select discount type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='percentage'>Percentage</SelectItem>
                    <SelectItem value='fixed'>Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type='number'
                  placeholder='Discount Value'
                  value={
                    newCoupon.discountValue === 0 ? '' : newCoupon.discountValue
                  }
                  onChange={e =>
                    setNewCoupon({
                      ...newCoupon,
                      discountValue: Number(e.target.value),
                    })
                  }
                  required
                />
                <Input
                  type='number'
                  placeholder='Minimum Purchase'
                  value={
                    newCoupon.minPurchase === 0 ? '' : newCoupon.minPurchase
                  }
                  onChange={e =>
                    setNewCoupon({
                      ...newCoupon,
                      minPurchase: Number(e.target.value),
                    })
                  }
                  required
                />
                <Input
                  type='date'
                  placeholder='Start Date'
                  value={newCoupon.startDate}
                  onChange={e =>
                    setNewCoupon({ ...newCoupon, startDate: e.target.value })
                  }
                  required
                />
                <Input
                  type='date'
                  placeholder='End Date'
                  value={newCoupon.endDate}
                  onChange={e =>
                    setNewCoupon({ ...newCoupon, endDate: e.target.value })
                  }
                  required
                />
                <Input
                  type='number'
                  placeholder='Usage Limit (optional)'
                  value={newCoupon.usageLimit || ''}
                  onChange={e =>
                    setNewCoupon({
                      ...newCoupon,
                      usageLimit: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                />
                <Button type='submit' className='w-full'>
                  Add Coupon
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          {selectedCoupons.length > 0 && (
            <Button
              variant='destructive'
              onClick={handleBulkDelete}
              disabled={loading}
            >
              Delete Selected ({selectedCoupons.length})
            </Button>
          )}
        </div>
      </div>
      <Card className='py-0'>
        <CardContent className='p-2 md:p-4'>
          <Input
            type='text'
            placeholder='Search by code or description...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full'
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedCoupons.length === filteredCoupons.length &&
                      filteredCoupons.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>CODE</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead>DISCOUNT</TableHead>
                <TableHead>VALIDITY</TableHead>
                <TableHead>USAGE</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center'>
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map(coupon => (
                  <TableRow key={coupon._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCoupons.includes(coupon._id)}
                        onCheckedChange={checked =>
                          handleSelectCoupon(coupon._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.description}</TableCell>
                    <TableCell>
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </TableCell>
                    <TableCell>
                      {formatDate(coupon.startDate)} -{' '}
                      {formatDate(coupon.endDate)}
                    </TableCell>
                    <TableCell>
                      {coupon.usedCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600'
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
