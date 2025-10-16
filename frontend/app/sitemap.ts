import { MetadataRoute } from 'next';
import { getProducts } from './lib/products';

interface ProductResponse {
  products: Array<{
    slug: string;
    updatedAt: string | Date;
  }>;
  total_pages: number;
}

const criticalPages = [
  {
    url: '/',
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 1,
  },
  {
    url: '/about',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: '/contact-us',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: '/products',
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  },
  {
    url: '/cart',
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  },
  {
    url: '/account',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  {
    url: '/privacy-policy',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
  {
    url: '/terms-of-service',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const firstPage = (await getProducts(1)) as ProductResponse;
  const totalPages = firstPage.total_pages || 1;

  const allProductsPromises = Array.from({ length: totalPages }, (_, i) =>
    getProducts(i + 1)
  );

  const allPages = await Promise.all(allProductsPromises);
  const products = allPages.flatMap(
    (page: ProductResponse) => page.products || []
  );

  const productsEntries: MetadataRoute.Sitemap = products.map(
    ({ slug, updatedAt }: { slug: string; updatedAt: string | Date }) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`,
      lastModified: new Date(updatedAt).toISOString(),
      changeFrequency: 'monthly',
      priority: 1,
    })
  );

  return [
    ...criticalPages.map(page => ({
      ...page,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${page.url}`,
    })),
    ...productsEntries,
  ];
}
