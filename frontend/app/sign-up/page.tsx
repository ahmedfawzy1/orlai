import Client from './client';
import generateSEO from '../lib/seo';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Sign Up | Lustria',
    description:
      'Create your Lustria account to enjoy exclusive offers, fast checkout, and order tracking.',
  });
};

export default function page() {
  return <Client />;
}
