'use client';

import { useState, useEffect } from 'react';
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
import { useCustomerStore } from '@/app/store/useCustomerStore';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function CustomersPage() {
  const {
    customers = [],
    loading,
    error: storeError,
    pagination = { currentPage: 1, totalPages: 1, totalCustomers: 0 },
    searchQuery,
    deleteCustomer,
    getCustomers,
    updateCustomerApi,
    setSearchQuery,
  } = useCustomerStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    getCustomers(currentPage, itemsPerPage, searchQuery);
  }, [currentPage, getCustomers, searchQuery]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCustomers([]);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      toast.success('Customer deleted successfully');
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to delete customer';
      toast.error(errorMessage);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedCustomers.map(id => deleteCustomer(id)));
      toast.success('Selected customers deleted successfully');
      setSelectedCustomers([]);
    } catch (error: any) {
      console.error('Error deleting selected customers:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to delete selected customers';
      toast.error(errorMessage);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    getCustomers(1, itemsPerPage, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEdit = (customer: any) => {
    setEditRowId(customer._id);
    setEditData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (customerId: string) => {
    try {
      await updateCustomerApi(customerId, editData);
      toast.success('Customer updated successfully');
      setEditRowId(null);
      setEditData({});
    } catch (error: any) {
      console.error('Error updating customer:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update customer';
      toast.error(errorMessage);
    }
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  if (storeError) {
    toast.error(storeError);
  }

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
          <TableCell>
            <Skeleton className='h-4 w-32' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className='px-4 pt-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Customers</h1>
        {selectedCustomers.length > 0 && (
          <Button
            variant='destructive'
            onClick={handleBulkDelete}
            disabled={loading}
            className='h-8'
          >
            Delete Selected ({selectedCustomers.length})
          </Button>
        )}
      </div>
      <Card className='py-0'>
        <CardContent className='p-2 md:p-4 flex justify-between'>
          <form onSubmit={handleSearch} className='w-full flex gap-2'>
            <Input
              type='text'
              placeholder='Search by name, or email...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full'
            />
            <Button type='submit' className='w-20 h-10'>
              Search
            </Button>
            <Button type='button' onClick={handleReset} className='w-20 h-10'>
              Reset
            </Button>
          </form>
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
                      selectedCustomers.length === customers.length &&
                      customers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>JOINING DATE</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center'>
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map(customer => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer._id)}
                        onCheckedChange={checked =>
                          handleSelectCustomer(customer._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>{customer._id}</TableCell>
                    {editRowId === customer._id ? (
                      <>
                        <TableCell>
                          <Input
                            name='first_name'
                            value={editData.first_name}
                            onChange={handleEditChange}
                            className='w-24'
                          />
                          <Input
                            name='last_name'
                            value={editData.last_name}
                            onChange={handleEditChange}
                            className='w-24 mt-1'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name='email'
                            value={editData.email}
                            onChange={handleEditChange}
                            className='w-48'
                          />
                        </TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            size='sm'
                            onClick={() => handleEditSave(customer._id)}
                            className='mr-2'
                          >
                            Save
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <span>{`${customer.first_name} ${customer.last_name}`}</span>
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600'
                            onClick={() => handleEdit(customer)}
                            disabled={loading}
                          >
                            Edit
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600'
                            onClick={() => handleDeleteCustomer(customer._id)}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Pagination Controls */}
      <div className='flex items-center mt-4'>
        <div className='flex-1 flex justify-center'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                  className='w-8 h-8 p-0'
                  disabled={loading}
                >
                  {page}
                </Button>
              ),
            )}
            <Button
              variant='outline'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
