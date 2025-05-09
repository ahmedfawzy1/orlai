'use client';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/app/store/useAuthStore';

interface AuthButtonsProps {
  login: { title: string; url: string };
}

const AuthButtons = ({ login }: AuthButtonsProps) => {
  const { authUser, logout } = useAuthStore();

  return (
    <>
      {authUser ? (
        <Button
          variant='default'
          size='sm'
          onClick={() => logout()}
          className='cursor-pointer'
        >
          Logout
        </Button>
      ) : (
        <Button asChild variant='default' size='sm'>
          <Link href={login.url}>{login.title}</Link>
        </Button>
      )}
    </>
  );
};

export default AuthButtons;
