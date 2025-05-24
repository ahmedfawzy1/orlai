'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/tabs';
import { Product } from '@/app/types/product';
import { CircleUser } from 'lucide-react';
import React from 'react';
import ReactStars from 'react-rating-star-with-type';

export default function TabMenu({ product }: { product: Product }) {
  return (
    <Tabs defaultValue='description' className='w-full mt-8'>
      <TabsList className='mb-2 w-full h-auto border-b border-gray-200 bg-transparent p-0 rounded-none'>
        <TabsTrigger
          value='description'
          className='mr-6 px-0 py-2 h-auto border-b-2 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-black border-transparent !shadow-none !outline-0 rounded-none text-base'
        >
          Descriptions
        </TabsTrigger>
        <TabsTrigger
          value='additional'
          className='mr-6 px-0 py-2 h-auto border-b-2 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-black border-transparent !shadow-none !outline-0 rounded-none text-base'
        >
          Additional Information
        </TabsTrigger>
        <TabsTrigger
          value='reviews'
          className='px-0 py-2 h-auto border-b-2 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-black border-transparent !shadow-none !outline-0 rounded-none text-base'
        >
          Reviews
        </TabsTrigger>
      </TabsList>
      <TabsContent value='description' className='pt-1'>
        <p className='text-gray-700 text-base mb-4'>{product.description}</p>
      </TabsContent>
      <TabsContent value='additional' className='pt-1'>
        <div className='flex flex-col gap-2 md:gap-4'>
          <div className='flex items-start gap-8'>
            <span className='font-semibold text-base min-w-[80px]'>Color</span>
            <span className='text-gray-700 text-base'>
              {product.variants
                .map((variant: any) => variant.color.name)
                .join(', ')}
            </span>
          </div>
          <div className='flex items-start gap-8'>
            <span className='font-semibold text-base min-w-[80px]'>Size</span>
            <span className='text-gray-700 text-base'>
              {product.variants.map((variant: any) => variant.size).join(', ')}
            </span>
          </div>
        </div>
      </TabsContent>
      <TabsContent value='reviews' className='pt-1'>
        <div className='mb-6'>
          <h3 className='text-lg font-bold mb-3'>Customer Reviews</h3>
          <div className='mb-3 flex items-center gap-2'>
            <CircleUser size={40} strokeWidth={1.2} />
            <div className='flex flex-col gap-0.5'>
              <span className='font-semibold text-nowrap'>Mark Williams</span>
              <span className='text-yellow-500'>
                <ReactStars count={5} size={16} activeColor='#ffd700' />
              </span>
            </div>
          </div>
          <div>
            <p className='text-black text-base mb-2'>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English.
            </p>
            <div className='text-xs text-gray-400'>
              Review by <span className='text-black font-semibold'>Krist</span>{' '}
              | Posted on{' '}
              <span className='text-black font-semibold'>June 05, 2023</span>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
