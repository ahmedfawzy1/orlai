import Client from './Client';
import generateSEO from '../lib/seo';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Your Cart | Orlai',
    description:
      'View and manage the items in your shopping cart. Secure checkout and fast delivery with Orlai.',
  });
};

export default function CartPage() {
  return <Client />;
}
