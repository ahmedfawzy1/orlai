'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Skeleton } from '../ui/skeleton';
import { X } from 'lucide-react';

interface FilterData {
  categories: any[];
  colors: any[];
  sizes: any[];
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filterData: FilterData;
  onFilter: (queryParams: any) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  filterData,
  onFilter,
}: SidebarProps) {
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 250,
  ]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRange: [0, 250] as [number, number],
    searchQuery: '',
    sort: 'createdAt',
    order: 'desc' as 'asc' | 'desc',
  });

  // Use server-provided filter data instead of store
  const { categories, colors, sizes } = filterData;

  useEffect(() => {
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    const search = searchParams.get('search');

    const newFilters: any = {};

    if (category) newFilters.categories = category.split(',');
    if (color) newFilters.colors = color.split(',');
    if (size) newFilters.sizes = size.split(',');
    if (minPrice && maxPrice) {
      newFilters.priceRange = [Number(minPrice), Number(maxPrice)];
    }
    if (sort) newFilters.sort = sort;
    if (order) newFilters.order = order;
    if (search) newFilters.searchQuery = search;

    if (Object.keys(newFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  }, [searchParams, setFilters]);

  useEffect(() => {
    updateFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Initialize tempPriceRange when filters change
  useEffect(() => {
    setTempPriceRange([filters.priceRange[0], filters.priceRange[1]]);
  }, [filters.priceRange]);

  const defaultFilters = {
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 250],
    searchQuery: '',
    sort: 'createdAt',
    order: 'desc',
  };

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.categories.length > 0) {
      params.set('category', filters.categories.join(','));
    } else {
      params.delete('category');
    }

    if (filters.colors.length > 0) {
      params.set('color', filters.colors.join(','));
    } else {
      params.delete('color');
    }

    if (filters.sizes.length > 0) {
      params.set('size', filters.sizes.join(','));
    } else {
      params.delete('size');
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 250) {
      params.set('min_price', filters.priceRange[0].toString());
      params.set('max_price', filters.priceRange[1].toString());
    } else {
      params.delete('min_price');
      params.delete('max_price');
    }

    // Only set sort if not default
    if (filters.sort && filters.sort !== defaultFilters.sort) {
      params.set('sort', filters.sort);
    } else {
      params.delete('sort');
    }

    // Only set order if not default
    if (filters.order && filters.order !== defaultFilters.order) {
      params.set('order', filters.order);
    } else {
      params.delete('order');
    }

    // Only set page if not 1
    if (searchParams.get('page') && searchParams.get('page') !== '1') {
      // keep current page param if not 1
    } else {
      params.delete('page');
    }

    if (filters.searchQuery) {
      params.set('search', filters.searchQuery);
    } else {
      params.delete('search');
    }

    router.push(`/shop?${params.toString()}`, { scroll: false });

    // Call the filter handler with the query parameters
    const queryParams = {
      page: Number(params.get('page')) || 1,
      limit: 12,
      ...(filters.categories.length > 0 && {
        category: filters.categories.join(','),
      }),
      ...(filters.colors.length > 0 && {
        color: filters.colors.join(','),
      }),
      ...(filters.sizes.length > 0 && {
        size: filters.sizes.join(','),
      }),
      ...(filters.priceRange[0] > 0 && {
        min_price: filters.priceRange[0],
      }),
      ...(filters.priceRange[1] < 250 && {
        max_price: filters.priceRange[1],
      }),
      ...(filters.searchQuery && {
        search: filters.searchQuery,
      }),
      ...(filters.sort && {
        sort: filters.sort,
        order: filters.order,
      }),
    };

    onFilter(queryParams);
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleColorChange = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSizeChange = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setTempPriceRange([value[0], value[1]] as [number, number]);
  };

  const handlePriceCommit = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }));
  };

  const renderCategorySkeletons = () => (
    <div className='space-y-2'>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className='flex items-center space-x-2'>
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-4 w-24' />
        </div>
      ))}
    </div>
  );

  const renderColorSkeletons = () => (
    <div className='space-y-2'>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-20' />
          </div>
          <Skeleton className='h-4 w-8' />
        </div>
      ))}
    </div>
  );

  const renderSizeSkeletons = () => (
    <div className='space-y-2'>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-8' />
          </div>
          <Skeleton className='h-4 w-8' />
        </div>
      ))}
    </div>
  );

  const renderPriceSkeletons = () => (
    <div className='px-2'>
      <Skeleton className='h-6 w-full mt-6' />
      <div className='flex justify-between mt-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-4 w-16' />
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 lg:static z-50 h-full w-[85vw] max-w-xs lg:w-[300px] bg-background transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-none rounded-none flex-shrink-0 overflow-y-auto`}
      >
        <div className='flex md:hidden items-center justify-between px-4 pt-3 md:pt-0 pb-2 border-b'>
          <h3 className='text-lg font-bold !no-underline pt-0 flex items-center'>
            Filter
          </h3>
          <button
            className='lg:hidden'
            onClick={() => setIsOpen(false)}
            aria-label='Close sidebar'
          >
            <span className='sr-only'>Close</span>
            <X size={20} />
          </button>
        </div>
        <Accordion
          type='multiple'
          defaultValue={['categories', 'price', 'color', 'size']}
          className='space-y-4 px-4 pt-4 md:pt-0 pb-4'
        >
          <AccordionItem value='categories'>
            <AccordionTrigger className='pt-0 pb-2 md:py-4 text-lg font-bold !no-underline flex items-center'>
              Product Categories
            </AccordionTrigger>
            <AccordionContent>
              {categories.length === 0 ? (
                renderCategorySkeletons()
              ) : (
                <div className='space-y-2 md:space-y-3'>
                  {categories.map(category => (
                    <div
                      key={category.name}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={category.name}
                        checked={filters.categories.includes(category.name)}
                        onCheckedChange={() =>
                          handleCategoryChange(category.name)
                        }
                      />
                      <label
                        htmlFor={category.name}
                        className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='price'>
            <AccordionTrigger className='pt-0 pb-0 md:py-4 text-lg font-bold !no-underline flex items-center'>
              Filter by Price
            </AccordionTrigger>
            <AccordionContent>
              {categories.length === 0 ? (
                renderPriceSkeletons()
              ) : (
                <div className='px-2'>
                  <Slider
                    value={tempPriceRange}
                    max={250}
                    step={1}
                    className='mt-6'
                    onValueChange={handlePriceChange}
                    onValueCommit={handlePriceCommit}
                  />
                  <div className='flex justify-between mt-2'>
                    <span className='text-sm'>${tempPriceRange[0]}</span>
                    <span className='text-sm'>${tempPriceRange[1]}</span>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='color'>
            <AccordionTrigger className='pt-0 pb-2 md:py-4 text-lg font-bold !no-underline flex items-center'>
              Filter by Color
            </AccordionTrigger>
            <AccordionContent>
              {colors.length === 0 ? (
                renderColorSkeletons()
              ) : (
                <div className='space-y-2'>
                  {colors.map(color => (
                    <div key={color.name}>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id={color.name}
                          checked={filters.colors.includes(color.name)}
                          onCheckedChange={() => handleColorChange(color.name)}
                        />
                        <span className='text-sm'>{color.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='size'>
            <AccordionTrigger className='pt-0 pb-3 md:py-4 text-lg font-bold !no-underline flex items-center'>
              Filter by Size
            </AccordionTrigger>
            <AccordionContent>
              {sizes.length === 0 ? (
                renderSizeSkeletons()
              ) : (
                <div className='space-y-3'>
                  {sizes.map(size => (
                    <div key={size.name}>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id={`size-${size.name}`}
                          checked={filters.sizes.includes(size.name)}
                          onCheckedChange={() => handleSizeChange(size.name)}
                        />
                        <label
                          htmlFor={`size-${size.name}`}
                          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {size.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </aside>
    </>
  );
}
