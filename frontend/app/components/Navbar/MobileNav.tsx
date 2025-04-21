'use client';

import { MenuItem } from './menuConfig';
import { Menu, Heart, ShoppingBag, X, Search } from 'lucide-react';
import { icons } from './icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '../ui/input';
import { useState } from 'react';
interface MobileNavProps {
  menuItems: MenuItem[];
  logo: {
    url: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  auth: {
    login: { title: string; url: string };
  };
}

const MobileNav = ({ menuItems, logo, auth }: MobileNavProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(searchQuery);
  };
  return (
    <div className='block px-4 lg:hidden'>
      <div className='flex items-center justify-between'>
        <Link href={logo.url} className='flex items-center gap-2'>
          <Image
            width={logo.width}
            height={logo.height}
            src={logo.src}
            className='max-h-8'
            alt={logo.alt}
            priority
          />
        </Link>
        <div className='flex items-center gap-2'>
          <Sheet>
            <SheetTrigger asChild>
              <button className='h-fit cursor-pointer'>
                <Search size={22} strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent side='top' className='w-full'>
              <SheetHeader className='px-4 py-2'>
                <SheetTitle>Search</SheetTitle>
                <form onSubmit={handleSearch} className='mt-2'>
                  <div className='relative'>
                    <Input
                      type='text'
                      placeholder='Search for products...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className='w-full !ring-0'
                    />
                    {searchQuery && (
                      <button
                        type='button'
                        onClick={() => setSearchQuery('')}
                        className='absolute right-2 top-1/2 -translate-y-1/2'
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </form>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Link href={'/wishlist'}>
            <Heart size={22} strokeWidth={1.5} />
          </Link>
          <Link href={'/cart'}>
            <ShoppingBag size={22} strokeWidth={1.5} />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button className='w-6' variant='ghost' size='icon'>
                <Menu className='size-4' />
              </Button>
            </SheetTrigger>
            <SheetContent className='overflow-y-auto'>
              <SheetHeader>
                <SheetTitle>
                  <Link href={logo.url} className='flex items-center gap-2'>
                    <Image
                      width={logo.width}
                      height={logo.height}
                      src={logo.src}
                      className='max-h-8'
                      alt={logo.alt}
                      priority
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className='flex flex-col gap-6 p-4'>
                <Accordion
                  type='single'
                  collapsible
                  className='flex w-full flex-col gap-4'
                >
                  {menuItems.map(item => renderMobileMenuItem(item))}
                </Accordion>

                <div className='flex flex-col gap-3'>
                  <Button asChild variant='outline'>
                    <Link href={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                  <Button asChild variant='default'>
                    <Link href={'/signup'}>Sign up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className='border-b-0'>
        <AccordionTrigger className='text-md py-0 font-semibold hover:no-underline'>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map(subItem => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className='text-md font-semibold'>
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className='flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground'
      href={item.url}
    >
      <div className='text-foreground'>{item.icon && icons[item.icon]}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-sm leading-snug text-muted-foreground'>
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MobileNav;
