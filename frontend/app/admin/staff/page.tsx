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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { axiosInstance } from '@/app/lib/axios';

interface Admin {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
}

export default function StaffPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [promoteEmail, setPromoteEmail] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admins');
      if (response.status !== 200) throw new Error('Failed to fetch admins');
      const data = await response.data;
      setAdmins(data);
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/admins', newAdmin);
      if (response.status !== 201) {
        const error = await response.data;
        throw new Error(error.message || 'Failed to add admin');
      }
      toast.success('Admin added successfully');
      setIsAddDialogOpen(false);
      setNewAdmin({ first_name: '', last_name: '', email: '', password: '' });
      fetchAdmins();
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message || 'Failed to add admin');
    }
  };

  const handlePromoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/admins/by-email', {
        email: promoteEmail,
      });
      if (response.status !== 200) {
        const error = await response.data;
        throw new Error(error.message || 'Failed to promote user to admin');
      }
      toast.success('User promoted to admin successfully');
      setIsAddDialogOpen(false);
      setPromoteEmail('');
      fetchAdmins();
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error(
        error.response.data.message || 'Failed to promote user to admin'
      );
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      const response = await axiosInstance.delete(`/admins/${adminId}`);

      if (response.status !== 200) {
        const error = await response.data;
        throw new Error(error.message || 'Failed to remove admin');
      }

      toast.success('Admin removed successfully');
      fetchAdmins();
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message || 'Failed to remove admin');
    }
  };

  const handleBulkRemove = async () => {
    try {
      await Promise.all(selectedAdmins.map(id => handleRemoveAdmin(id)));
      setSelectedAdmins([]);
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error(
        error.response.data.message || 'Failed to remove selected admins'
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAdmins(filteredAdmins.map(a => a._id));
    } else {
      setSelectedAdmins([]);
    }
  };

  const handleSelectAdmin = (adminId: string, checked: boolean) => {
    if (checked) {
      setSelectedAdmins(prev => [...prev, adminId]);
    } else {
      setSelectedAdmins(prev => prev.filter(id => id !== adminId));
    }
  };

  const filteredAdmins = useMemo(() => {
    if (!admins) return [];
    let result = [...admins];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        admin =>
          admin._id.toLowerCase().includes(query) ||
          admin.first_name.toLowerCase().includes(query) ||
          admin.last_name.toLowerCase().includes(query) ||
          admin.email.toLowerCase().includes(query)
      );
    }
    return result;
  }, [admins, searchQuery]);

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
        <h1 className='text-2xl font-bold'>Admins</h1>
        <div className='flex gap-2'>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Admin</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue='new' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='new'>New Admin</TabsTrigger>
                  <TabsTrigger value='promote'>Promote User</TabsTrigger>
                </TabsList>
                <TabsContent value='new'>
                  <form onSubmit={handleAddAdmin} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        placeholder='First Name'
                        value={newAdmin.first_name}
                        onChange={e =>
                          setNewAdmin({
                            ...newAdmin,
                            first_name: e.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        placeholder='Last Name'
                        value={newAdmin.last_name}
                        onChange={e =>
                          setNewAdmin({
                            ...newAdmin,
                            last_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <Input
                      type='email'
                      placeholder='Email'
                      value={newAdmin.email}
                      onChange={e =>
                        setNewAdmin({ ...newAdmin, email: e.target.value })
                      }
                      required
                    />
                    <Input
                      type='password'
                      placeholder='Password'
                      value={newAdmin.password}
                      onChange={e =>
                        setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                      required
                    />
                    <Button type='submit' className='w-full'>
                      Add Admin
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value='promote'>
                  <form onSubmit={handlePromoteToAdmin} className='space-y-4'>
                    <Input
                      type='email'
                      placeholder='User Email'
                      value={promoteEmail}
                      onChange={e => setPromoteEmail(e.target.value)}
                      required
                    />
                    <Button type='submit' className='w-full'>
                      Promote to Admin
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          {selectedAdmins.length > 0 && (
            <Button
              variant='destructive'
              onClick={handleBulkRemove}
              disabled={loading}
            >
              Remove Selected ({selectedAdmins.length})
            </Button>
          )}
        </div>
      </div>
      <Card className='py-0'>
        <CardContent className='p-2 md:p-4'>
          <Input
            type='text'
            placeholder='Search by ID, name, or email...'
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
                      selectedAdmins.length === filteredAdmins.length &&
                      filteredAdmins.length > 0
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
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center'>
                    No admins found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map(admin => (
                  <TableRow key={admin._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAdmins.includes(admin._id)}
                        onCheckedChange={checked =>
                          handleSelectAdmin(admin._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>{admin._id}</TableCell>
                    <TableCell>
                      {`${admin.first_name} ${admin.last_name}`}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{formatDate(admin.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600'
                        onClick={() => handleRemoveAdmin(admin._id)}
                        disabled={loading}
                      >
                        Remove
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
