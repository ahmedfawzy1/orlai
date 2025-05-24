import { getProduct, getProducts } from '@/app/lib/products';
import { getServerSession } from '@/app/lib/auth';
import React from 'react';
import ImageGallery from '@/app/components/shop/[slug]/ImageGallery';
import ProductDetails from '@/app/components/shop/[slug]/ProductDetails';
import TabMenu from '@/app/components/shop/[slug]/TabMenu';
import RelatedProducts from '@/app/components/shop/[slug]/RelatedProducts';

export const revalidate = 3600;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const { _id } = await getServerSession();
  const { products } = await getProducts();

  return (
    <section className='px-5 py-8 max-w-[1280px] mx-auto'>
      <div className='flex flex-col md:flex-row gap-10 mt-10'>
        <ImageGallery ImageUrls={product.images} />
        <ProductDetails product={product} userId={_id} />
      </div>
      <TabMenu product={product} />
      <RelatedProducts products={products} />
    </section>
  );
}
