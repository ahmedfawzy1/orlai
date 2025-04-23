import Hero from './components/Home/Hero';
import Category from './components/Home/Category';
import BestSelling from './components/Home/BestSelling';
import DealTimer from './components/Home/DealTimer';

export default function Home() {
  return (
    <>
      <Hero />
      <Category />
      <BestSelling />
      <DealTimer />
    </>
  );
}
