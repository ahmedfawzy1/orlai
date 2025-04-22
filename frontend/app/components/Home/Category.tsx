'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Casual Wear',
    image: '/images/category/category1.avif',
  },
  {
    id: 2,
    name: 'Western Wear',
    image: '/images/category/category2.avif',
  },
  {
    id: 3,
    name: 'Ethnic Wear',
    image: '/images/category/category3.avif',
  },
  {
    id: 4,
    name: 'Kids Wear',
    image: '/images/category/category4.avif',
  },
];

export default function Category() {
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = 280;
      const scrollAmount = cardWidth;
      scrollRef.current.scrollTo({
        left:
          direction === 'left'
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setScrollLeft(scrollLeft > 0);
      setScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollButtons);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateScrollButtons);
      }
    };
  }, []);

  return (
    <section className='px-5 py-10 max-w-[1280px] mx-auto'>
      <div className='flex justify-between items-center gap-4'>
        <h5 className='text-2xl md:text-3xl lg:text-[40px] font-semibold font-integralCF'>
          Shop by Categories
        </h5>

        <div className='flex flex-nowrap flex-row gap-4 pt-1'>
          <button
            onClick={() => scroll('left')}
            aria-label='Scroll left'
            disabled={!scrollLeft}
            className={`p-2.5 bg-[#f3f3f3] rounded-[8px] ${
              scrollLeft ? 'bg-black' : ''
            } transition-colors`}
          >
            <ArrowLeft size={16} color={scrollLeft ? '#fff' : '#ccc'} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label='Scroll right'
            disabled={!scrollRight}
            className={`p-2.5 bg-[#f3f3f3] rounded-[8px] ${
              scrollRight ? 'bg-black' : ''
            } transition-colors`}
          >
            <ArrowRight size={16} color={scrollRight ? '#fff' : '#ccc'} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className='w-full mt-6 md:mt-7 flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory'
      >
        {categories.map(category => (
          <div
            key={category.id}
            className='bg-[#f3f3f3] w-[280px] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-2rem)] h-[250px] md:h-[300px] relative flex-shrink-0 overflow-hidden'
          >
            <h3 className='text-6xl font-bold text-[#e8e8e8] absolute top-2 left-6'>
              {category.name.split(' ')[0]}
            </h3>
            <Image
              src={category.image}
              alt={category.name}
              width={488}
              height={843}
              className='w-full h-full object-contain relative z-10'
              draggable={false}
              priority={true}
            />
            <Link
              href={`/shop?category=${category.name}`}
              className='px-4 py-2 text-black text-lg font-medium text-center w-[calc(100%-2rem)] absolute bottom-5 left-1/2 z-10 -translate-x-1/2 bg-white rounded-lg hover:scale-105 transition-all duration-300'
            >
              {category.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
