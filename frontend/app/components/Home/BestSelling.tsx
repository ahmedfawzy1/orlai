'use client';

import Link from 'next/link';
import ItemCard from '../shop/ItemCard';
import { Product } from '@/app/types/product';
import { motion } from 'framer-motion';

interface BestSellingProps {
  products: Product[];
}

export default function BestSelling({ products }: BestSellingProps) {
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
        duration: 0.8,
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
  } as any;

  return (
    <motion.section
      className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12'
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h4
        className='text-3xl md:text-[42px] font-semibold text-center'
        variants={itemVariants}
      >
        Our BestSeller
      </motion.h4>

      <motion.div
        className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-10 pb-8'
        variants={containerVariants}
      >
        {products?.map((product: Product, index: number) => (
          <motion.div key={product._id} variants={cardVariants} custom={index}>
            <ItemCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div className='text-center' variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            className='inline-block px-6 md:px-10 py-3 rounded-full text-gray-800 bg-white border-2 border-gray-800 shadow-sm hover:bg-gray-800 hover:text-white transition-all duration-300 font-medium'
            href='/bestseller'
            prefetch={false}
          >
            View All
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
