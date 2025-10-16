'use client';

import { Product } from '../types/product';
import ItemCard from '../components/shop/ItemCard';
import Sidebar from '../components/shop/Sidebar';
import { ArrowLeft, ArrowRight, SlidersVertical } from 'lucide-react';
import { PaginationContent, PaginationItem } from '../components/ui/pagination';
import { Pagination } from '../components/ui/pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProducts } from '../lib/products';

interface ShopData {
  products: Product[];
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

interface FilterData {
  categories: any[];
  colors: any[];
  sizes: any[];
}

interface ShopProps {
  initialData: ShopData;
  filterData: FilterData;
}

export default function Shop({ initialData, filterData }: ShopProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClientLoading, setIsClientLoading] = useState(false);
  const [hasClientData, setHasClientData] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(initialData.products);
  const [displayTotalPages, setDisplayTotalPages] = useState(
    initialData.total_pages,
  );
  const [displayCurrentPage, setDisplayCurrentPage] = useState(
    initialData.current_page,
  );

  // Reset client data flag when page changes (navigation)
  useEffect(() => {
    setHasClientData(false);
  }, [currentPage]);

  // Update display data when initial data changes, but only if we don't have client data
  useEffect(() => {
    if (!hasClientData) {
      setDisplayProducts(initialData.products);
      setDisplayTotalPages(initialData.total_pages);
      setDisplayCurrentPage(initialData.current_page);
    }
  }, [initialData, hasClientData]);

  // Handle client-side data fetching for pagination/filtering
  const fetchClientData = async (page: number, queryParams: any = {}) => {
    setIsClientLoading(true);
    try {
      const response = await getProducts(page, 12, queryParams);
      setDisplayProducts(response.products);
      setDisplayTotalPages(response.total_pages);
      setDisplayCurrentPage(response.current_page);
      setHasClientData(true);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setIsClientLoading(false);
    }
  };

  // Handle filtering
  const handleFilter = (queryParams: any) => {
    fetchClientData(1, queryParams);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page === 1) {
      router.push('/shop');
    } else {
      router.push(`/shop?page=${page}`);
    }
    // Only fetch if it's a different page than current
    if (page !== displayCurrentPage) {
      fetchClientData(page);
    }
  };

  return (
    <section className='px-5 py-2 md:py-10 max-w-[1280px] mx-auto min-h-screen'>
      <div className='flex flex-row justify-between items-start gap-10'>
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          filterData={filterData}
          onFilter={handleFilter}
        />
        <div className='flex-1'>
          <h1 className='sr-only'>Shop The Latest Fashion Products at Orlai</h1>
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
          {isClientLoading ? (
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
              {displayProducts?.map((product: Product) => (
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
              {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map(
                pageNum => (
                  <PaginationItem key={pageNum}>
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`flex items-center justify-center h-10 px-4 text-sm font-medium ${
                        pageNum === displayCurrentPage
                          ? 'bg-gray-900 text-white'
                          : 'text-black bg-white hover:bg-gray-50'
                      } border border-black rounded-md cursor-pointer`}
                    >
                      {pageNum}
                    </button>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= displayTotalPages}
                  className={`${
                    currentPage >= displayTotalPages
                      ? 'pointer-events-none text-gray-400'
                      : ''
                  } cursor-pointer`}
                  aria-disabled={currentPage >= displayTotalPages}
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
