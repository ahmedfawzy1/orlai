import Hero from './components/Home/Hero';
import Category from './components/Home/Category';
import BestSelling from './components/Home/BestSelling';
import DealTimer from './components/Home/DealTimer';
import Review from './components/Home/Review';
import { getAllBestSellingProducts } from './lib/products';
import { getAllReviews } from './lib/reviews';

export const revalidate = 3600;

async function getProductsAndReviewsData() {
  try {
    const [bestSellingProducts, reviewsResponse] = await Promise.all([
      getAllBestSellingProducts(),
      getAllReviews(1, 10, '-createdAt'),
    ]);

    return {
      bestSellingProducts: bestSellingProducts || [],
      reviews: reviewsResponse?.reviews || [],
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      bestSellingProducts: [],
      reviews: [],
    };
  }
}

export default async function Home() {
  const { bestSellingProducts, reviews } = await getProductsAndReviewsData();

  return (
    <main>
      <Hero />
      <Category />
      <BestSelling products={bestSellingProducts} />
      <DealTimer />
      <Review reviews={reviews} />
    </main>
  );
}
