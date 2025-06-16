import Client from './Client';
import generateSEO from '../lib/seo';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Your Wishlist | Lustria',
    description:
      'Save your favorite products to your wishlist. Easily keep track of items you love at Lustria.',
  });
};
export default function WishlistPage() {
  return <Client />;
}
