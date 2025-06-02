'use client';

import { useState } from 'react';
import { SquarePen } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const { authUser: user } = useAuthStore();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode) {
    }
    setEditMode(!editMode);
  };

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center gap-3 mb-4'>
        <h1 className='text-2xl md:text-3xl font-semibold'>My Profile</h1>
        <form onSubmit={handleEditSave}>
          <button
            type='submit'
            className={`px-6 py-3 rounded-lg bg-black text-white text-sm md:text-base hover:bg-gray-900 flex items-center gap-2`}
          >
            <SquarePen size={18} />
            {editMode ? 'Update' : 'Edit Profile'}
          </button>
        </form>
      </div>
      <div className='flex items-start gap-8'>
        <form
          className='flex-1 grid grid-cols-2 gap-6'
          onSubmit={handleEditSave}
        >
          <div>
            <label className='block text-sm font-medium mb-1'>First Name</label>
            <input
              type='text'
              name='first_name'
              className='w-full border border-black rounded-md px-3 py-2.5 focus:outline-none'
              value={form.first_name}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder='First Name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Last Name</label>
            <input
              type='text'
              name='last_name'
              className='w-full border border-black rounded-md px-3 py-2.5 focus:outline-none'
              value={form.last_name}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder='Last Name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Phone Number
            </label>
            <input
              type='text'
              name='phone'
              className='w-full border border-black rounded-md px-3 py-2.5 focus:outline-none'
              value={form.phone}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder='Phone Number'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              className='w-full border border-black rounded-md px-3 py-2.5 focus:outline-none'
              value={form.email}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder='Email Address'
            />
          </div>
          <div className='col-span-2'>
            <label className='block text-sm font-medium mb-1'>Address</label>
            <input
              type='text'
              name='address'
              className='w-full border border-black rounded-md px-3 py-2.5 focus:outline-none'
              value={form.address}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder='Address'
            />
          </div>
        </form>
      </div>
    </div>
  );
}
