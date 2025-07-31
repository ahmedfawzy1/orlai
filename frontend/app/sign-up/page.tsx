import Client from './client';
import generateSEO from '../lib/seo';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Sign Up | Orlai',
    description:
      'Create your Orlai account to enjoy exclusive offers, fast checkout, and order tracking.',
  });
};

export default function page() {
  return <Client />;
}
