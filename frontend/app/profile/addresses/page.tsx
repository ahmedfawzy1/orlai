'use client';

import { useState } from 'react';
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

interface Address {
  id: number;
  name: string;
  phone: string;
  addressLine: string;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: 'Robert Fox',
      phone: '(209) 555-0104',
      addressLine: '4517 Washington Ave. Manchester, Kentucky 39495',
    },
    {
      id: 2,
      name: 'John Willions',
      phone: '(270) 555-0117',
      addressLine: '3891 Ranchview Dr. Richardson, California 62639',
    },
    {
      id: 3,
      name: 'Alexa Johnson',
      phone: '(208) 555-0112',
      addressLine: '4517 Washington Ave. Manchester, Kentucky 39495',
    },
  ]);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    flatHouse: '',
    area: '',
    city: '',
    pinCode: '',
    state: '',
    defaultAddress: false,
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddAddress() {
    if (!formData.name.trim()) return;

    const newAddress: Address = {
      id: Date.now(),
      name: formData.name,
      phone: formData.mobileNumber,
      addressLine: `${formData.flatHouse}, ${formData.area}, ${formData.city}, ${formData.state} ${formData.pinCode}`,
    };
    setAddresses(prev => [...prev, newAddress]);
    setFormData({
      name: '',
      mobileNumber: '',
      flatHouse: '',
      area: '',
      city: '',
      pinCode: '',
      state: '',
      defaultAddress: false,
    });
    setOpen(false);
  }

  function handleDelete(id: number) {
    setAddresses(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className='px-4 md:px-0'>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className='flex justify-end pt-4'>
          <DialogTrigger asChild>
            <Button variant='default' size='lg'>
              + Add New Address
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Add a new address</DialogTitle>
            <DialogDescription>
              Fill in the form below to add a new address.
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
              <Label className='mb-2' htmlFor='mobileNumber'>
                Mobile Number
              </Label>
              <Input
                id='mobileNumber'
                name='mobileNumber'
                placeholder='Enter Mobile Number'
                value={formData.mobileNumber}
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
            <Button className='py-5 md:py-0' onClick={handleAddAddress}>
              Add New Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div>
        {addresses.map(({ id, name, phone, addressLine }) => (
          <div
            key={id}
            className='flex justify-between items-start py-4 border-b'
          >
            <div>
              <h3 className='font-bold text-lg'>{name}</h3>
              <p className='text-sm py-1'>{addressLine}</p>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Phone size={16} />
                <span>{phone}</span>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Button
                variant='outline'
                size='sm'
                aria-label='Edit address'
                className='bg-white text-black shadow rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-gray-50 border-none'
              >
                <SquarePen size={20} />
                Edit
              </Button>
              <Button
                variant='outline'
                size='sm'
                aria-label='Delete address'
                onClick={() => handleDelete(id)}
                className='bg-red-50 text-red-500 shadow rounded-sm px-4 py-2 flex items-center gap-2 hover:bg-red-100 border-none'
              >
                <Trash2 size={20} />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
