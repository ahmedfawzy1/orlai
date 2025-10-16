'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';

const DesktopUserMenu = () => {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label='User menu'>
        <button
          className='h-fit cursor-pointer outline-none'
          type='button'
          aria-label='User menu'
        >
          <User size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[180px]'>
        {session?.user?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href='/admin' className='w-full'>
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href='/profile/orders' className='w-full'>
            Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/profile' className='w-full'>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {session?.user ? (
          <DropdownMenuItem
            onClick={() => signOut({ redirect: false })}
            className='text-destructive'
          >
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href='/login' className='w-full'>
              Login
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DesktopUserMenu;
