import Shop from './client';
import generateSEO from '../lib/seo';
import { Suspense } from 'react';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Discover Our Collection | Lustria',
    description:
      'Shop the latest trends and find your perfect style at Lustria. Explore our curated collection of high-quality clothing for men, women, and kids.',
  });
};

export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shop />
    </Suspense>
  );
}
