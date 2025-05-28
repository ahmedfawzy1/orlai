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
      <DropdownMenuTrigger asChild>
        <User className='size-6 cursor-pointer' />
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
          <Link href='/settings' className='w-full'>
            Settings
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
