import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function DealTimer() {
  return (
    <section className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 flex flex-col-reverse md:flex-row gap-4 md:gap-8'>
      <div className='flex justify-center flex-col basis-1/2'>
        <h3 className='text-2xl md:text-3xl font-medium pb-2 md:pb-4'>
          Deals of the Month
        </h3>
        <p className='text-gray-700'>
          Discover the timeless elegance of our latest collection, designed with
          sophistication and style in mind. Each piece is crafted to provide the
          perfect blend of comfort and class, Explore the variety and find your
          next wardrobe staple today.
        </p>

        <div className='flex justify-center md:justify-start gap-4 pt-6 md:pt-8 pb-6 md:pb-10'>
          <div className='flex flex-col justify-center items-center border-1 border-gray-200 rounded-lg w-[75px] h-[75px]'>
            <p className='text-2xl md:text-3xl font-bold'>120</p>
            <p className='text-sm md:text-base text-gray-700 font-semibold'>
              Days
            </p>
          </div>
          <div className='flex flex-col justify-center items-center border-1 border-gray-200 rounded-lg w-[75px] h-[75px]'>
            <p className='text-2xl md:text-3xl font-bold'>18</p>
            <p className='text-sm md:text-base text-gray-700 font-semibold'>
              Hours
            </p>
          </div>
          <div className='flex flex-col justify-center items-center border-1 border-gray-200 rounded-lg w-[75px] h-[75px]'>
            <p className='text-2xl md:text-3xl font-bold'>15</p>
            <p className='text-sm md:text-base text-gray-700 font-semibold'>
              Minutes
            </p>
          </div>
          <div className='flex flex-col justify-center items-center border-1 border-gray-200 rounded-lg w-[75px] h-[75px]'>
            <p className='text-2xl md:text-3xl font-bold'>00</p>
            <p className='text-sm md:text-base text-gray-700 font-semibold'>
              Seconds
            </p>
          </div>
        </div>

        <Link
          href='/shop'
          className='px-8 py-3 w-fit mx-auto md:mx-0 rounded-lg bg-black text-sm md:text-base text-white flex items-center gap-1 transition duration-300 hover:bg-gray-800'
        >
          View All Products
          <ArrowRight className='mt-0.5' size={20} />
        </Link>
      </div>

      <div className='flex flex-col basis-1/2'>
        <Image
          priority
          src='/images/deal/deal.avif'
          alt='hero'
          width={512}
          height={343}
          draggable={false}
          className='w-full h-full object-cover rounded-lg'
        />
      </div>
    </section>
  );
}
