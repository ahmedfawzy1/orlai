import type { Metadata } from 'next';

const defaultSEO: Metadata = {
  metadataBase: new URL('https://orlai.store'),
  title: 'Shop Trendy & Elegant Clothing - Orlai',
  description:
    'Discover premium fashion at Orlai - your destination for trendy, sustainable clothing. From casual essentials to elegant statement pieces, find your perfect style with our curated collection of high-quality garments.',
  openGraph: {
    type: 'website',
    url: 'https://orlai.store',
    title: 'Shop Trendy & Elegant Clothing - Orlai',
    siteName: 'Orlai',
    description:
      'Discover premium fashion at Orlai - your destination for trendy, sustainable clothing. From casual essentials to elegant statement pieces, find your perfect style with our curated collection of high-quality garments.',
    locale: 'en_US',
    images: [
      {
        url: 'https://orlai.store/images/opengraph.webp',
        alt: 'Orlai Fashion Store',
      },
    ],
  },
  twitter: {
    creator: '@orlai_fashion',
    site: 'https://orlai.store',
    card: 'summary_large_image',
  },
};

export default function generateSEO(props: Metadata = {}): Metadata {
  const seo: Metadata = { ...defaultSEO, ...props };
  seo.title += ' | Orlai';
  seo.openGraph = {
    ...seo.openGraph,
    title: seo.title || undefined,
    description: seo.description || undefined,
  };
  seo.twitter = {
    ...seo.twitter,
    site: seo.openGraph?.url?.toString(),
    title: seo.openGraph.title || undefined,
    images: seo.openGraph.images,
    description: seo.openGraph.description,
  };
  return { ...seo, ...props };
}
