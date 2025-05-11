import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/app/components/ui/button';
import {
  Home,
  ShoppingCart,
  Tag,
  Users,
  Truck,
  Gift,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';

const sidebarLinks = [
  { label: 'Dashboard', icon: <Home className='w-5 h-5' />, href: '/admin' },
  {
    label: 'Products',
    icon: <ShoppingCart className='w-5 h-5' />,
    href: '/admin/products',
  },
  {
    label: 'Categories',
    icon: <Tag className='w-5 h-5' />,
    href: '/admin/categories',
  },
  {
    label: 'Customers',
    icon: <Users className='w-5 h-5' />,
    href: '/admin/customers',
  },
  {
    label: 'Orders',
    icon: <Truck className='w-5 h-5' />,
    href: '/admin/orders',
  },
  {
    label: 'Coupons',
    icon: <Gift className='w-5 h-5' />,
    href: '/admin/coupons',
  },
  { label: 'Staff', icon: <User className='w-5 h-5' />, href: '/admin/staff' },
  {
    label: 'Settings',
    icon: <Settings className='w-5 h-5' />,
    href: '/admin/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md'
      >
        {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
      </button>

      {/* Overlay for mobile, with blur and stronger dim */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 z-40 backdrop-blur-sm bg-black/60 transition-opacity duration-300'
          style={{ left: '16rem' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static w-64 h-screen bg-white border-r flex flex-col justify-between z-50 shadow-2xl lg:shadow-[0_8px_32px_0_rgba(60,72,88,0.12)] transition-transform duration-300 ease-in-out rounded-r-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ top: 0, left: 0 }}
      >
        <div>
          {/* Close button inside sidebar (mobile only) */}
          <div className='flex lg:hidden justify-end p-4'>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-md hover:bg-gray-100 focus:outline-none'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
          <nav className='flex flex-col gap-1 px-2'>
            {sidebarLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 w-full mb-1 px-4 py-3 rounded-lg transition-colors relative font-medium text-base
                      ${
                        isActive
                          ? 'bg-gray-50 font-bold text-black'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  style={{
                    fontWeight: isActive ? 'bold' : 'normal',
                  }}
                >
                  {/* Green bar for active link */}
                  {isActive && (
                    <span className='absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r'></span>
                  )}
                  <span className='ml-2'>{link.icon}</span>
                  <span className='ml-2'>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className='p-4'>
          <Button
            variant='default'
            className='w-full gap-2 bg-green-500 hover:bg-green-600 text-white cursor-pointer'
            onClick={() => logout()}
          >
            <LogOut className='w-5 h-5' /> Log out
          </Button>
        </div>
      </aside>
    </>
  );
}
