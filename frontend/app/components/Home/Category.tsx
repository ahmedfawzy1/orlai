'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Casual Wear',
    image: '/images/category/category1.avif',
    slug: 'Bottomwear',
  },
  {
    id: 2,
    name: 'Western Wear',
    image: '/images/category/category2.avif',
    slug: 'Outerwear',
  },
  {
    id: 3,
    name: 'Ethnic Wear',
    image: '/images/category/category3.avif',
    slug: 'Knitwear',
  },
  {
    id: 4,
    name: 'Kids Wear',
    image: '/images/category/category4.avif',
    slug: 'Footwear',
  },
];

export default function Category() {
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  } as any;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  } as any;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  } as any;

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
    <motion.section
      className='px-5 py-10 max-w-[1280px] mx-auto'
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className='flex justify-between items-center gap-4'
        variants={itemVariants}
      >
        <h3 className='text-2xl md:text-3xl lg:text-[40px] font-semibold'>
          Shop by Categories
        </h3>

        <div className='flex flex-nowrap flex-row gap-4 pt-1'>
          <motion.button
            onClick={() => scroll('left')}
            aria-label='Scroll left'
            disabled={!scrollLeft}
            className={`p-2.5 bg-[#f3f3f3] rounded-[8px] ${
              scrollLeft ? 'bg-black' : ''
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} color={scrollLeft ? '#fff' : '#ccc'} />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            aria-label='Scroll right'
            disabled={!scrollRight}
            className={`p-2.5 bg-[#f3f3f3] rounded-[8px] ${
              scrollRight ? 'bg-black' : ''
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight size={16} color={scrollRight ? '#fff' : '#ccc'} />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        ref={scrollRef}
        className='w-full mt-6 md:mt-7 flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory'
        variants={containerVariants}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className='bg-[#f3f3f3] w-[280px] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-2rem)] h-[250px] md:h-[300px] relative flex-shrink-0 overflow-hidden'
            variants={cardVariants}
            whileHover='hover'
            custom={index}
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
              href={`/shop?category=${category.slug}`}
              className='px-4 py-2 text-black text-lg font-medium text-center w-[calc(100%-2rem)] absolute bottom-5 left-1/2 z-10 -translate-x-1/2 bg-white rounded-lg hover:scale-105 transition-all duration-300'
            >
              {category.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
