'use client';

import { useAuthStore } from '@/app/store/useAuthStore';
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
  const { authUser, logout } = useAuthStore();

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
        {authUser?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href='/admin' className='w-full'>
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href='/orders' className='w-full'>
            Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/profile' className='w-full'>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {authUser ? (
          <DropdownMenuItem onClick={logout} className='text-destructive'>
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
