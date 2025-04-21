import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className='w-full relative bg-[#f3f3f3] flex flex-col md:flex-row justify-between items-center'>
      <div className='px-6 max-w-[577px] min-h-[500px] flex flex-col justify-center items-center'>
        <div className='text-center md:text-left'>
          <h1 className='text-3xl md:text-4xl mb-5'>Classic Exclusive</h1>
          <h2 className='text-3xl md:text-5xl font-black mb-5'>
            Women's Collection
          </h2>
          <h3 className='text-3xl md:text-4xl mb-10'>UPTO 40% OFF</h3>
          <Link
            href='/shop'
            className='px-8 py-3 w-fit mx-auto md:mx-0 rounded-xl bg-black text-white flex items-center gap-1 transition duration-300 hover:bg-gray-800'
          >
            Shop Now
            <ArrowRight className='mt-0.5' size={20} />
          </Link>
        </div>
      </div>
      <div className='hidden lg:block'>
        <Image
          priority
          src='/images/hero/hero.avif'
          alt='hero'
          width={500}
          height={500}
          draggable={false}
        />
      </div>
    </section>
  );
}
