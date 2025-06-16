import Hero from './components/Home/Hero';
import Category from './components/Home/Category';
import BestSelling from './components/Home/BestSelling';
import DealTimer from './components/Home/DealTimer';
import Review from './components/Home/Review';

export default function Home() {
  return (
    <>
      <Hero />
      <Category />
      <BestSelling />
      <DealTimer />
      <Review />
    </>
  );
}
