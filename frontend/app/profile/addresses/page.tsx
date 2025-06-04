'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Trash2, Phone, SquarePen } from 'lucide-react';

import { useAddressStore } from '@/app/store/useAddressStore';

export default function AddressPage() {
  const {
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    isLoading,
  } = useAddressStore();

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    fetchAddresses();
  }, [fetchAddresses]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
    if (!formData.name.trim()) return;

    if (editingId) {
      const success = await updateAddress(editingId, formData);
      if (success) {
        resetForm();
        setOpen(false);
      }
    } else {
      const success = await addAddress(formData);
      if (success) {
        resetForm();
        setOpen(false);
      }
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
    setOpen(true);
  }

  async function handleDelete(id: string) {
    setAddressToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (addressToDelete) {
      await deleteAddress(addressToDelete);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  }

  return (
    <div className='px-4 md:px-0'>
      <Dialog
        open={open}
        onOpenChange={isOpen => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <div className='flex justify-end pt-4'>
          <DialogTrigger asChild>
            <Button variant='default' size='lg'>
              {editingId ? 'Edit Address' : '+ Add New Address'}
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Address' : 'Add a new address'}
            </DialogTitle>
            <DialogDescription>
              Fill in the form below to {editingId ? 'update' : 'add'} an
              address.
            </DialogDescription>
          </DialogHeader>
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
              />
            </div>
          </div>
          <DialogFooter className='flex justify-between'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className='py-5 md:py-0' onClick={handleSubmit}>
              {editingId ? 'Update Address' : 'Add New Address'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex justify-between'>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={confirmDelete}
              className='bg-red-500 hover:bg-red-600'
            >
              Delete Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div>Loading addresses...</div>
      ) : (
        <div>
          {addresses.length === 0 && <p>No addresses found.</p>}
          {addresses.map(addr => (
            <div
              key={addr._id}
              className='flex justify-between items-start py-4 border-b'
            >
              <div>
                <h3 className='font-bold text-lg'>{addr.name}</h3>
                <p className='text-sm py-1'>
                  {addr.flatHouse}, {addr.area}, {addr.city}, {addr.state}{' '}
                  {addr.pinCode}
                </p>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Phone size={16} />
                  <span>{addr.phone}</span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  aria-label='Edit address'
                  className='bg-white text-black shadow rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-gray-50 border-none'
                  onClick={() => startEdit(addr)}
                >
                  <SquarePen size={20} />
                  Edit
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  aria-label='Delete address'
                  onClick={() => handleDelete(addr._id)}
                  className='bg-red-50 text-red-500 shadow rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-red-100 border-none'
                >
                  <Trash2 size={20} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
