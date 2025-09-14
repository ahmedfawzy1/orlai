'use client';

import Hero from './components/Home/Hero';
import Category from './components/Home/Category';
import BestSelling from './components/Home/BestSelling';
import DealTimer from './components/Home/DealTimer';
import Review from './components/Home/Review';
import { motion } from 'framer-motion';

export default function Home() {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  } as any;

  const sectionVariants = {
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

  return (
    <motion.main variants={pageVariants} initial='hidden' animate='visible'>
      <motion.div variants={sectionVariants}>
        <Hero />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <Category />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <BestSelling />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <DealTimer />
      </motion.div>
      <motion.div variants={sectionVariants}>
        <Review />
      </motion.div>
    </motion.main>
  );
}
