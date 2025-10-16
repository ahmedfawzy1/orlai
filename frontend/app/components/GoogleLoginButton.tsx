'use client';

import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { useCartStore } from '../store/useCartStore';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      // Use NextAuth's Google provider
      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.error) {
        toast.error('Google login failed. Please try again.');
        return;
      }

      if (result?.ok) {
        // Sync cart after successful login
        const cartStore = useCartStore.getState();
        cartStore.clearInvalidItems();
        await cartStore.syncLocalCartToBackend();

        toast.success('Logged in with Google successfully');
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant='outline'
      className='py-[20px] w-full transition-all duration-300 cursor-pointer'
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderCircle className='animate-spin' />
      ) : (
        <>
          <Image
            src='/images/icons/google.svg'
            alt='google'
            width={24}
            height={24}
          />
          Login with Google
        </>
      )}
    </Button>
  );
}
