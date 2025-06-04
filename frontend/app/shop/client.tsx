'use client';

import { useProductStore } from '../store/useProductStore';
import { Product } from '../types/product';
import ItemCard from '../components/shop/ItemCard';
import Sidebar from '../components/shop/Sidebar';
import { ArrowLeft, ArrowRight, SlidersVertical } from 'lucide-react';
import { PaginationContent, PaginationItem } from '../components/ui/pagination';
import { Pagination } from '../components/ui/pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Shop() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    products,
    totalPages,
    isLoading,
    getProducts,
    setCurrentPage,
    currentPage: storeCurrentPage,
  } = useProductStore();

  // Sync URL with store state
  useEffect(() => {
    if (currentPage !== storeCurrentPage) {
      setCurrentPage(currentPage);
      getProducts(currentPage, 12);
    }
  }, [currentPage, storeCurrentPage, getProducts, setCurrentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page === 1) {
      router.push('/shop');
    } else {
      router.push(`/shop?page=${page}`);
    }
  };

  return (
    <section className='px-5 py-2 md:py-10 max-w-[1280px] mx-auto min-h-screen'>
      <div className='flex flex-row justify-between items-start gap-10'>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className='flex-1'>
          <h1 className='sr-only'>
            Shop The Latest Fashion Products at Lustria
          </h1>
          <div className='pb-2 flex md:hidden items-center justify-between'>
            <h3 className='text-xl font-bold !no-underline pt-0 flex items-center'>
              Filter
            </h3>
            <button
              className='p-2 hover:bg-gray-100 rounded-full'
              aria-label='Toggle filters'
              onClick={() => setIsSidebarOpen(true)}
            >
              <SlidersVertical size={20} />
            </button>
          </div>
          {isLoading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-8'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className='w-full aspect-[3/4] bg-gray-100 animate-pulse rounded-xl'
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-8'>
              {products?.map((product: Product) => (
                <ItemCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <Pagination>
            <PaginationContent className='gap-2'>
              <PaginationItem>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`${
                    currentPage <= 1 ? 'text-gray-400 pointer-events-none' : ''
                  } cursor-pointer`}
                  aria-disabled={currentPage <= 1}
                  aria-label='Previous'
                >
                  <ArrowLeft size={22} />
                </button>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                pageNum => (
                  <PaginationItem key={pageNum}>
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`flex items-center justify-center h-10 px-4 text-sm font-medium ${
                        pageNum === currentPage
                          ? 'bg-gray-900 text-white'
                          : 'text-black bg-white hover:bg-gray-50'
                      } border border-black rounded-md cursor-pointer`}
                    >
                      {pageNum}
                    </button>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`${
                    currentPage >= totalPages
                      ? 'pointer-events-none text-gray-400'
                      : ''
                  } cursor-pointer`}
                  aria-disabled={currentPage >= totalPages}
                  aria-label='Next'
                >
                  <ArrowRight size={22} />
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
}
