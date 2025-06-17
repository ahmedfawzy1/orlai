'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
// import { getReviews } from '@/app/lib/review';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactStars from 'react-rating-star-with-type';
import reviewData from '@/app/data/review.json';

interface Review {
  id: number;
  rating: number;
  comment: string;
  User: {
    id: number;
    username: string;
    email: string;
  };
  Product: {
    id: number;
    description: string;
  };
}

export default function Review() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // const { reviews } = await getReviews();
        // setReviews(reviews);
        setReviews(reviewData.reviews);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    fetchReviews();
  }, []);

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
    <section className='px-5 py-10 bg-[#fafafa]'>
      <div className='flex justify-between items-center'>
        <h4 className='text-2xl md:text-3xl font-semibold'>
          What Our Happy Customer Say's
        </h4>

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
        className='w-full py-10 flex gap-3 overflow-x-auto scrollbar-hide'
      >
        {reviews?.length > 0 &&
          reviews.map((review, index) => (
            <div
              key={index}
              className='w-[360px] md:w-96 px-5 md:px-6 py-6 md:py-6 bg-white shadow-sm rounded-lg'
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
                  {review.User.username}.
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
