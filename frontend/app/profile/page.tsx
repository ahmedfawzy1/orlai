'use client';

import { useState, useEffect } from 'react';
import { SquarePen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/app/lib/axios';

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode) {
      try {
        await axiosInstance.put('/auth/profile', {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone || null,
        });

        toast.success('Profile updated successfully');
        // Refresh the session to get updated data
        window.location.reload();
        setEditMode(false);
      } catch (error) {
        toast.error('Failed to update profile');
        console.error(error);
      }
    } else {
      setEditMode(true);
    }
  };

  return (
    <div className='p-8 max-w-2xl mx-auto'>
      <div className='flex justify-between items-center gap-3 mb-4'>
        <h1 className='text-2xl md:text-3xl font-semibold'>My Profile</h1>
        <form onSubmit={handleEditSave}>
          <button
            type='submit'
            className='px-6 py-3 rounded-lg bg-black text-white text-sm md:text-base hover:bg-gray-900 flex items-center gap-2'
          >
            <SquarePen size={18} />
            {editMode ? 'Save' : 'Edit Profile'}
          </button>
        </form>
      </div>

      <form className='grid grid-cols-2 gap-6' onSubmit={handleEditSave}>
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
            required
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
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Phone Number</label>
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
            className='w-full border border-black rounded-md px-3 py-2.5 focus:outline-none bg-gray-100'
            value={form.email}
            readOnly
            placeholder='Email Address'
          />
        </div>
      </form>
    </div>
  );
}
