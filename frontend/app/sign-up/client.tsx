'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';

export default function Client() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const { isSigningUp, signup } = useAuthStore();

  const validateForm = () => {
    const { first_name, last_name, email, password } = formData;
    if (!first_name || !last_name || !email || !password) {
      toast.error('Please fill all fields');
      return false;
    }
    if (first_name.length < 1 || first_name.length > 50) {
      toast.error('First name must be between 1 and 50 characters');
      return false;
    }
    if (last_name.length < 1 || last_name.length > 50) {
      toast.error('Last name must be between 1 and 50 characters');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Please provide a valid email address');
      return false;
    }
    if (password.length < 6 || password.length > 128) {
      toast.error('Password must be between 6 and 128 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await signup(formData);
      if (success) {
        router.push('/');
      }
    }
  };
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='relative hidden bg-muted lg:block'>
        <Image
          src='/images/registration/signup.avif'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
          width={845}
          height={1024}
          priority
        />
      </div>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Create New account</h1>
                <p className='text-balance text-sm text-muted-foreground'>
                  Please enter your details to create an account
                </p>
              </div>
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label className='text-sm' htmlFor='firstname'>
                    First Name
                  </Label>
                  <Input
                    id='firstname'
                    type='text'
                    placeholder='First Name'
                    required
                    className='border-black focus-visible:!ring-0'
                    onChange={e =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label className='text-sm' htmlFor='lastname'>
                    Last Name
                  </Label>
                  <Input
                    id='lastname'
                    type='text'
                    placeholder='Last Name'
                    required
                    className='border-black focus-visible:!ring-0'
                    onChange={e =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label className='text-sm' htmlFor='email'>
                    Email Address
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    required
                    className='border-black focus-visible:!ring-0'
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label className='text-sm' htmlFor='password'>
                      Password
                    </Label>
                  </div>
                  <Input
                    className='border-black focus-visible:!ring-0'
                    id='password'
                    type='password'
                    required
                    onChange={e =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <Button
                  type='submit'
                  className='w-full py-5 font-normal transition-all duration-300 cursor-pointer'
                >
                  {isSigningUp ? (
                    <LoaderCircle className='animate-spin' />
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
              <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link className='hover:underline' href='/login'>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
