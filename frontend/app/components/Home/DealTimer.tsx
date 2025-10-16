'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DealTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 120,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set a target time (e.g., 120 days from now)
    const targetTime = new Date();
    targetTime.setDate(targetTime.getDate() + 120);
    targetTime.setHours(23, 59, 59, 999); // Set to end of day

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: 120, // Keep days static as requested
          hours,
          minutes,
          seconds,
        });
      } else {
        // Timer has ended
        setTimeLeft({
          days: 120,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  } as any;

  const timerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  } as any;

  const imageVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  } as any;

  return (
    <motion.section
      className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 flex flex-col-reverse md:flex-row gap-4 md:gap-8 overflow-hidden'
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.5, margin: '0px 0px -100px 0px' }}
    >
      <motion.div
        className='flex justify-center flex-col basis-1/2'
        variants={itemVariants}
      >
        <motion.h3
          className='text-2xl md:text-3xl font-medium pb-2 md:pb-4'
          variants={itemVariants}
        >
          Deals of the Month
        </motion.h3>
        <motion.p className='text-gray-700' variants={itemVariants}>
          Discover the timeless elegance of our latest collection, designed with
          sophistication and style in mind. Each piece is crafted to provide the
          perfect blend of comfort and class, Explore the variety and find your
          next wardrobe staple today.
        </motion.p>

        <motion.div
          className='flex justify-center md:justify-start gap-4 pt-6 md:pt-8 pb-6 md:pb-10 overflow-hidden'
          variants={containerVariants}
        >
          {[
            { value: timeLeft.days.toString().padStart(2, '0'), label: 'Days' },
            {
              value: timeLeft.hours.toString().padStart(2, '0'),
              label: 'Hours',
            },
            {
              value: timeLeft.minutes.toString().padStart(2, '0'),
              label: 'Minutes',
            },
            {
              value: timeLeft.seconds.toString().padStart(2, '0'),
              label: 'Seconds',
            },
          ].map((timer, index) => (
            <motion.div
              key={timer.label}
              className='flex flex-col justify-center items-center border-1 border-gray-200 rounded-lg w-[75px] h-[75px]'
              variants={timerVariants}
              whileHover='hover'
              custom={index}
            >
              <p className='text-2xl md:text-3xl font-bold'>{timer.value}</p>
              <p className='text-sm md:text-base text-gray-700 font-semibold'>
                {timer.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href='/shop'
              className='px-8 py-3 w-fit mx-auto md:mx-0 rounded-lg bg-black text-sm md:text-base text-white flex items-center gap-1 transition duration-300 hover:bg-gray-800'
            >
              View All Products
              <ArrowRight className='mt-0.5' size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className='flex flex-col basis-1/2 overflow-hidden'
        variants={imageVariants}
      >
        <Image
          priority
          src='/images/deal/deal.avif'
          alt='hero'
          width={512}
          height={343}
          draggable={false}
          className='w-full h-full object-cover rounded-lg'
        />
      </motion.div>
    </motion.section>
  );
}
