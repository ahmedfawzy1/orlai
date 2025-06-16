import type { Metadata } from 'next';

const defaultSEO: Metadata = {
  metadataBase: new URL('https://lustria.in'),
  title: 'Shop Trendy & Elegant Clothing - Lustria',
  description:
    'Discover premium fashion at Lustria - your destination for trendy, sustainable clothing. From casual essentials to elegant statement pieces, find your perfect style with our curated collection of high-quality garments.',
  openGraph: {
    type: 'website',
    url: 'https://lustria.in',
    title: 'Shop Trendy & Elegant Clothing - Lustria',
    siteName: 'Lustria',
    description:
      'Discover premium fashion at Lustria - your destination for trendy, sustainable clothing. From casual essentials to elegant statement pieces, find your perfect style with our curated collection of high-quality garments.',
    locale: 'en_US',
    images: [
      {
        url: 'https://lustria.in/images/opengraph.webp',
        alt: 'Lustria Fashion Store',
      },
    ],
  },
  twitter: {
    creator: '@lustria_fashion',
    site: 'https://lustria.in',
    card: 'summary_large_image',
  },
};

export default function generateSEO(props: Metadata = {}): Metadata {
  const seo: Metadata = { ...defaultSEO, ...props };
  seo.title += ' | Lustria';
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
