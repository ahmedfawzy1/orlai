import { getProduct, getProducts } from '@/app/lib/products';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import React from 'react';
import ImageGallery from '@/app/components/shop/[slug]/ImageGallery';
import ProductDetails from '@/app/components/shop/[slug]/ProductDetails';
import TabMenu from '@/app/components/shop/[slug]/TabMenu';
import RelatedProducts from '@/app/components/shop/[slug]/RelatedProducts';
import generateSEO from '@/app/lib/seo';

export const revalidate = 3600;

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    return generateSEO({
      title: 'Product Not Found | Orlai',
      description:
        'Oops! The product you are looking for is unavailable. Explore our latest collections at Orlai.',
    });
  }

  return generateSEO({
    title: `${product.name} | Buy Online at Orlai`,
    description:
      product.description.length > 150
        ? `${product.description.substring(0, 150)}...`
        : `${product.description} Shop now for premium quality and exclusive designs.`,
  });
};

export const generateStaticParams = async () => {
  const response = await getProducts(1, 100);
  return response.products.map((product: any) => ({ slug: product.slug }));
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  const session = await getServerSession(authOptions);
  const relatedResponse = await getProducts(1, 3, {
    category: product.category?.name,
  });
  const products = relatedResponse.products;

  return (
    <section className='px-4 pb-4 md:py-8 max-w-[1280px] mx-auto'>
      <div className='flex flex-col md:flex-row gap-10'>
        <ImageGallery ImageUrls={product.images} />
        <ProductDetails product={product} userId={session?.user?.id || ''} />
      </div>
      <TabMenu product={product} />
      <RelatedProducts products={products} />
    </section>
  );
}
