'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactStars from 'react-rating-star-with-type';
import { motion } from 'framer-motion';
import { Review as ReviewType } from '@/app/types/review';

interface ReviewProps {
  reviews: ReviewType[];
}

export default function Review({ reviews }: ReviewProps) {
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
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  } as any;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = 372;
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
  }, [reviews]);

  return (
    <motion.section
      className='px-5 py-10 bg-[#fafafa]'
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className='flex justify-between items-center'
        variants={itemVariants}
      >
        <h4 className='text-2xl md:text-3xl font-semibold'>
          What Our Happy Customer Say's
        </h4>

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
        className='w-full py-10 flex gap-3 overflow-x-auto scrollbar-hide'
        variants={containerVariants}
      >
        {reviews?.length > 0 &&
          reviews.map((review, index) => (
            <motion.div
              key={review._id || index}
              className='w-[360px] md:w-96 px-5 md:px-6 py-6 md:py-6 bg-white shadow-sm rounded-lg'
              variants={cardVariants}
              whileHover='hover'
              custom={index}
            >
              <ReactStars
                value={review.rating}
                isEdit={false}
                size={18}
                activeColors={[
                  'red',
                  'orange',
                  '#FFCE00',
                  '#9177FF',
                  '#FFC633',
                ]}
              />
              <span className='w-80 max-h-24 block mt-3 text-black/60 font-normal overflow-hidden'>
                "{review.comment}"
              </span>
              <div className='flex gap-1 pt-3 pb-1.5'>
                <Image
                  src={'/images/icons/badgecheck.svg'}
                  alt='badgecheck'
                  width={24}
                  height={30}
                />
                <p className='text-xl font-bold mb-0.5'>
                  {review.name || 'Anonymous'}.
                </p>
              </div>
            </motion.div>
          ))}
      </motion.div>
    </motion.section>
  );
}
