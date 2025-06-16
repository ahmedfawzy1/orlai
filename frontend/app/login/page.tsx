import Client from './client';
import generateSEO from '../lib/seo';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Login | Lustria',
    description:
      'Login to your Lustria account to access your order history, wishlist, and personalized recommendations.',
  });
};

export default function page() {
  return <Client />;
}
