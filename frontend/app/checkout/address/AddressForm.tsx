'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { SquarePen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useAddressStore } from '@/app/store/useAddressStore';
import { useCheckoutStore } from '@/app/store/useCheckoutStore';

function AddressSkeleton() {
  return (
    <div className='flex flex-col sm:flex-row gap-4 mb-4'>
      {[1, 2].map(i => (
        <Card
          key={i}
          className='flex-1 bg-[#fafafa] rounded-md p-0 relative shadow-none'
        >
          <CardContent className='py-4 px-6 flex flex-col'>
            <div className='mb-2'>
              <Skeleton className='h-6 w-32 mb-2' />
              <Skeleton className='h-4 w-full mb-1' />
              <Skeleton className='h-4 w-3/4' />
            </div>
            <div className='flex gap-2 mt-4'>
              <Skeleton className='h-10 flex-1' />
              <Skeleton className='h-10 flex-1' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AddressForm() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { setSelectedAddress } = useCheckoutStore();
  const {
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddressStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    flatHouse: '',
    area: '',
    city: '',
    pinCode: '',
    state: '',
  });

  useEffect(() => {
    const loadAddresses = async () => {
      setIsInitialLoading(true);
      await fetchAddresses();
      setIsInitialLoading(false);
    };
    loadAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (!isInitialLoading && addresses.length > 0 && !selected) {
      setSelected(addresses[0]._id);
    }
  }, [isInitialLoading, addresses, selected]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData({
      name: '',
      phone: '',
      flatHouse: '',
      area: '',
      city: '',
      pinCode: '',
      state: '',
    });
    setEditingId(null);
  }

  async function handleSubmit() {
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (editingId) {
      const success = await updateAddress(editingId, formData);
      if (success) {
        resetForm();
        setEditDialogOpen(false);
      }
    } else {
      const success = await addAddress(formData);
      if (success) {
        resetForm();
      }
    }
  }

  async function handleDelete(id: string) {
    const success = await deleteAddress(id);
    if (success) {
      if (selected === id) {
        setSelected(null);
      }
    }
  }

  async function handleSelectAddress(id: string) {
    setSelected(id);
  }

  async function handleDeliverToAddress() {
    if (!selected) {
      toast.error('Please select a delivery address');
      return;
    }

    const selectedAddress = addresses.find(addr => addr._id === selected);
    if (selectedAddress) {
      setSelectedAddress(selectedAddress);
      router.push('/checkout/payment');
    }
  }

  function startEdit(address: typeof formData & { _id: string }) {
    setEditingId(address._id);
    setFormData({
      name: address.name,
      phone: address.phone,
      flatHouse: address.flatHouse,
      area: address.area,
      city: address.city,
      pinCode: address.pinCode,
      state: address.state,
    });
    setEditDialogOpen(true);
  }

  return (
    <div>
      <div className='mb-8'>
        <div className='flex flex-col gap-0.5 mb-4'>
          <h3 className='text-xl font-bold'>Select a delivery address</h3>
          <p className='text-sm text-black'>
            Is the address you'd like to use displayed below? If so, click the
            corresponding "Deliver to this address" button. Or you can enter a
            new delivery address.
          </p>
        </div>
        {isInitialLoading ? (
          <AddressSkeleton />
        ) : addresses.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
              {addresses.map(addr => (
                <Card
                  key={addr._id}
                  className={`basis-1/2 bg-[#fafafa] rounded-md p-0 relative shadow-none cursor-pointer ${
                    selected === addr._id
                      ? 'border border-black'
                      : 'border-transparent'
                  }`}
                  onClick={() => handleSelectAddress(addr._id)}
                >
                  <div className='absolute top-4 right-4'>
                    <Checkbox
                      checked={selected === addr._id}
                      onCheckedChange={() => handleSelectAddress(addr._id)}
                      onClick={e => e.stopPropagation()}
                      className='border border-gray-300 rounded focus:ring-0'
                    />
                  </div>
                  <CardContent className='py-4 px-6 flex flex-col'>
                    <div className='mb-2'>
                      <div className='font-bold text-lg mb-1'>{addr.name}</div>
                      <div className='text-sm text-gray-700'>
                        {`${addr.flatHouse}, ${addr.area}, ${addr.city}, ${addr.state} - ${addr.pinCode}`}
                      </div>
                    </div>
                    <div className='flex gap-2 mt-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        aria-label='Edit address'
                        className='bg-[#f1f1f3] text-black border-0 shadow-none rounded-md px-4 py-2.5 h-auto flex items-center gap-2 hover:bg-gray-100 flex-1'
                        onClick={e => {
                          e.stopPropagation();
                          startEdit(addr);
                        }}
                      >
                        <SquarePen size={18} />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        aria-label='Delete address'
                        className='bg-red-50 text-red-500 border-0 shadow-none rounded-md px-4 py-2.5 h-auto flex items-center gap-2 hover:bg-red-100 flex-1'
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(addr._id);
                        }}
                      >
                        <Trash2 size={18} />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              className='w-full py-6'
              onClick={handleDeliverToAddress}
              disabled={!selected}
            >
              Deliver to this address
            </Button>
          </>
        ) : null}
      </div>
      <hr className='my-8' />
      <div>
        <h2 className='text-2xl font-bold mb-2'>Add a new address</h2>
        <form
          className='flex flex-col gap-4'
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className='grid gap-4 py-4'>
            <div>
              <Label className='mb-2' htmlFor='name'>
                Name
              </Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter Name'
                value={formData.name}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='phone'>
                Mobile Number
              </Label>
              <Input
                id='phone'
                name='phone'
                placeholder='Enter Mobile Number'
                value={formData.phone}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='flatHouse'>
                Flat, House no., Building, Company, Apartment
              </Label>
              <Input
                id='flatHouse'
                name='flatHouse'
                placeholder='e.g., Flat 12B, Building A, Company XYZ'
                value={formData.flatHouse}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='area'>
                Area, Colony, Street, Sector, Village
              </Label>
              <Input
                id='area'
                name='area'
                placeholder='e.g., Green Park, Sector 5, Elm Street'
                value={formData.area}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='city'>
                City
              </Label>
              <Input
                id='city'
                name='city'
                placeholder='Enter City'
                value={formData.city}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='pinCode'>
                Pin Code
              </Label>
              <Input
                id='pinCode'
                name='pinCode'
                placeholder='Enter Pin Code'
                value={formData.pinCode}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='state'>
                State
              </Label>
              <Input
                id='state'
                name='state'
                placeholder='Enter State'
                value={formData.state}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
          </div>
          <Button type='submit' className='w-full max-w-xs'>
            Add New Address
          </Button>
        </form>
      </div>

      <Dialog
        open={editDialogOpen}
        onOpenChange={isOpen => {
          setEditDialogOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update your address information below.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div>
              <Label className='mb-2' htmlFor='edit-name'>
                Name
              </Label>
              <Input
                id='edit-name'
                name='name'
                placeholder='Enter Name'
                value={formData.name}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='edit-phone'>
                Mobile Number
              </Label>
              <Input
                id='edit-phone'
                name='phone'
                placeholder='Enter Mobile Number'
                value={formData.phone}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='edit-flatHouse'>
                Flat, House no., Building, Company, Apartment
              </Label>
              <Input
                id='edit-flatHouse'
                name='flatHouse'
                placeholder='e.g., Flat 12B, Building A, Company XYZ'
                value={formData.flatHouse}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='edit-area'>
                Area, Colony, Street, Sector, Village
              </Label>
              <Input
                id='edit-area'
                name='area'
                placeholder='e.g., Green Park, Sector 5, Elm Street'
                value={formData.area}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='edit-city'>
                City
              </Label>
              <Input
                id='edit-city'
                name='city'
                placeholder='Enter City'
                value={formData.city}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='edit-pinCode'>
                Pin Code
              </Label>
              <Input
                id='edit-pinCode'
                name='pinCode'
                placeholder='Enter Pin Code'
                value={formData.pinCode}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor='edit-state'>
                State
              </Label>
              <Input
                id='edit-state'
                name='state'
                placeholder='Enter State'
                value={formData.state}
                onChange={handleInputChange}
                className='!ring-0 border-black'
                required
              />
            </div>
          </div>
          <DialogFooter className='flex justify-between'>
            <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Update Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
