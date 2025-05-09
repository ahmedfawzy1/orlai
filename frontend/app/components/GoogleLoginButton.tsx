'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithGoogle = () => {
    try {
      setIsLoading(true);
      console.log('login with google');
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      variant='outline'
      className='py-[20px] w-full transition-all duration-300 cursor-pointer'
      onClick={loginWithGoogle}
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
