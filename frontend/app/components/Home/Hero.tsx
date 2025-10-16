'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  } as any;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  } as any;

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  } as any;

  return (
    <motion.section
      className='w-full relative bg-[#f3f3f3]'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center'>
        <motion.div
          className='px-6 max-w-[577px] min-h-[500px] flex flex-col justify-center items-center'
          variants={itemVariants}
        >
          <div className='text-center md:text-left'>
            <motion.h1
              className='text-3xl md:text-4xl mb-5'
              variants={itemVariants}
            >
              Classic Exclusive
            </motion.h1>
            <motion.h2
              className='text-3xl md:text-5xl font-black mb-5'
              variants={itemVariants}
            >
              Women's Collection
            </motion.h2>
            <motion.h3
              className='text-3xl md:text-4xl mb-10'
              variants={itemVariants}
            >
              UPTO 40% OFF
            </motion.h3>
            <motion.div variants={itemVariants}>
              <Link
                href='/shop'
                className='px-8 py-3 w-fit mx-auto md:mx-0 rounded-xl bg-black text-white flex items-center gap-1 transition duration-300 hover:bg-gray-800'
              >
                Shop Now
                <ArrowRight className='mt-0.5' size={20} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className='hidden lg:block' variants={imageVariants}>
          <Image
            priority
            src='/images/hero/hero.avif'
            alt='hero'
            width={500}
            height={500}
            draggable={false}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
