'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import { Button } from '@/app/components/ui/button';
import {
  LogOut,
  Menu,
  X,
  Package,
  Heart,
  MapPin,
  UserRound,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const sidebarLinks = [
  {
    label: 'Personal Information',
    icon: <UserRound size={20} />,
    href: '/profile',
  },
  { label: 'My Orders', icon: <Package size={20} />, href: '/profile/orders' },
  {
    label: 'My Wishlists',
    icon: <Heart size={20} />,
    href: '/profile/wishlists',
  },
  {
    label: 'Manage Addresses',
    icon: <MapPin size={20} />,
    href: '/profile/addresses',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-3 py-2.5 rounded-md bg-primary text-white text-sm font-medium flex items-center gap-2 shadow hover:bg-primary/90 transition-all duration-300 ease-in-out cursor-pointer ${
          isOpen ? 'hidden' : ''
        }`}
      >
        <Menu size={18} />
        <span className='font-medium'>Open Menu</span>
      </button>

      {/* Overlay for mobile, with blur and stronger dim */}
      <div
        className={`lg:hidden fixed inset-0 z-40 backdrop-blur-sm bg-black/60 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed lg:static w-64 h-full bg-white border border-gray-200 flex flex-col justify-between z-50 shadow-md transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ top: 0, left: 0 }}
      >
        <div>
          <div className='flex flex-row justify-between items-center py-1'>
            <div className='flex flex-col px-4 md:py-3 border-b border-gray-100 bg-white'>
              <h3 className='text-sm text-gray-500 flex items-center gap-1'>
                Hello <span className='text-lg'>👋</span>
              </h3>
              <p className='font-bold text-lg text-gray-900'>
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            {/* Close button inside sidebar (mobile only) */}
            <div className='flex lg:hidden justify-end p-4'>
              <button
                onClick={() => setIsOpen(false)}
                className='p-2 rounded-md hover:bg-gray-100 focus:outline-none'
                aria-label='Close sidebar'
              >
                <X className='w-6 h-6' />
              </button>
            </div>
          </div>
          <nav className='flex flex-col gap-1'>
            {sidebarLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 w-full mb-1 px-4 py-4 transition-colors relative text-base ${
                    isActive
                      ? 'bg-primary text-white font-semibold shadow'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className='p-4'>
          <Button
            variant='default'
            className='w-full py-5 gap-2 bg-primary hover:bg-primary/90 text-white cursor-pointer'
            onClick={() => logout()}
          >
            <LogOut className='w-5 h-5' /> Log out
          </Button>
        </div>
      </aside>
    </>
  );
}
