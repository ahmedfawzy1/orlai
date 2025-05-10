'use client';

import Link from 'next/link';
import { useProductStore } from '../store/useProductStore';
import { Product } from '../types/product';
import ItemCard from '../components/shop/ItemCard';
import Sidebar from '../components/shop/Sidebar';
import { ArrowLeft, ArrowRight, SlidersVertical } from 'lucide-react';
import { PaginationContent, PaginationItem } from '../components/ui/pagination';
import { Pagination } from '../components/ui/pagination';
import { useSearchParams } from 'next/navigation';

export default function Shop() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { products, totalPages, isLoading } = useProductStore();

  console.log('products', products);

  return (
    <section className='px-5 py-2 md:py-10 container mx-auto min-h-screen'>
      <div className='flex flex-row justify-between items-start gap-10'>
        <Sidebar />
        <div className='flex-1'>
          <h1 className='sr-only'>
            Shop The Latest Fashion Products at Lustria
          </h1>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-bold !no-underline pt-0 flex items-center'>
              Filter
            </h3>
            <button
              className='p-2 hover:bg-gray-100 rounded-full'
              aria-label='Toggle filters'
            >
              <SlidersVertical className='h-6 w-6' />
            </button>
          </div>
          {isLoading ? (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-8'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className='w-full aspect-[3/4] bg-gray-100 animate-pulse rounded-xl'
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-8'>
              {products?.map((product: Product) => (
                <ItemCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <Pagination>
            <PaginationContent className='gap-2'>
              <PaginationItem>
                <Link
                  href={
                    currentPage <= 2 ? '/shop' : `/shop?page=${currentPage - 1}`
                  }
                  className={
                    currentPage <= 1 ? 'text-gray-400 pointer-events-none' : ''
                  }
                  aria-disabled={currentPage <= 1}
                  aria-label='Previous'
                >
                  <ArrowLeft size={22} />
                </Link>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                pageNum => (
                  <PaginationItem key={pageNum}>
                    <Link
                      href={pageNum === 1 ? '/shop' : `/shop?page=${pageNum}`}
                      className={`flex items-center justify-center h-10 px-4 text-sm font-medium ${
                        pageNum === currentPage
                          ? 'bg-gray-900 text-white'
                          : 'text-black bg-white hover:bg-gray-50'
                      } border border-black rounded-md`}
                    >
                      {pageNum}
                    </Link>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <Link
                  href={`/shop?page=${currentPage + 1}`}
                  className={
                    currentPage >= totalPages
                      ? 'pointer-events-none text-gray-400'
                      : ''
                  }
                  aria-disabled={currentPage >= totalPages}
                  aria-label='Next'
                >
                  <ArrowRight size={22} />
                </Link>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
}
