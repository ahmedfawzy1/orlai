import Client from './client';
import generateSEO from '../lib/seo';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Login | Orlai',
    description:
      'Login to your Orlai account to access your order history, wishlist, and personalized recommendations.',
  });
};

export default async function page() {
  return <Client />;
}
