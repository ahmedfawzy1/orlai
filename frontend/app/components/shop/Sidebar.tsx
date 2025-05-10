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
import { Button } from '../ui/button';
import { SlidersVertical } from 'lucide-react';
import { useProductStore } from '@/app/store/useProductStore';

const productCategories = [
  'Men',
  'Women',
  'Kids',
  'Bags',
  'Belts',
  'Wallets',
  'Watches',
  'Accessories',
  'Winter Wear',
];

const colors = [
  { name: 'Red', count: 10 },
  { name: 'Blue', count: 14 },
  { name: 'Orange', count: 8 },
  { name: 'Black', count: 12 },
  { name: 'Green', count: 4 },
  { name: 'Yellow', count: 2 },
];

const sizes = [
  { name: 'S', count: 6 },
  { name: 'M', count: 20 },
  { name: 'L', count: 12 },
  { name: 'XL', count: 16 },
  { name: 'XXL', count: 10 },
  { name: 'XXXL', count: 3 },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useProductStore();

  useEffect(() => {
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (category) setFilters({ categories: [category] });
    if (color) setFilters({ colors: [color] });
    if (size) setFilters({ sizes: [size] });
    if (minPrice && maxPrice) {
      setFilters({
        priceRange: [Number(minPrice), Number(maxPrice)],
      });
    }
  }, [searchParams, setFilters]);

  const updateFilters = () => {
    const params = new URLSearchParams();

    if (filters.categories.length > 0) {
      params.set('category', filters.categories.join(','));
    }
    if (filters.colors.length > 0) {
      params.set('color', filters.colors.join(','));
    }
    if (filters.sizes.length > 0) {
      params.set('size', filters.sizes.join(','));
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 250) {
      params.set('minPrice', filters.priceRange[0].toString());
      params.set('maxPrice', filters.priceRange[1].toString());
    }

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({
      categories: filters.categories.includes(category)
        ? filters.categories.filter(c => c !== category)
        : [...filters.categories, category],
    });
  };

  const handleColorChange = (color: string) => {
    setFilters({
      colors: filters.colors.includes(color)
        ? filters.colors.filter(c => c !== color)
        : [...filters.colors, color],
    });
  };

  const handleSizeChange = (size: string) => {
    setFilters({
      sizes: filters.sizes.includes(size)
        ? filters.sizes.filter(s => s !== size)
        : [...filters.sizes, size],
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({ priceRange: [value[0], value[1]] });
  };

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
        className={`fixed lg:static z-50 w-[300px] h-full rounded-[2px] flex-shrink-0 bg-background transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Accordion
          type='multiple'
          defaultValue={['categories', 'price', 'color', 'size']}
          className='space-y-4 px-4 pt-4 md:pt-0 pb-4'
        >
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-bold !no-underline pt-0 flex items-center'>
              Filter
            </h3>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
            >
              <SlidersVertical className='h-6 w-6' />
            </Button>
          </div>

          <AccordionItem value='categories'>
            <AccordionTrigger className='text-lg font-bold !no-underline pt-0 flex items-center'>
              Product Categories
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                {productCategories.map(category => (
                  <div key={category} className='flex items-center space-x-2'>
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label
                      htmlFor={category}
                      className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='price'>
            <AccordionTrigger className='text-lg font-bold !no-underline flex items-center'>
              Filter by Price
            </AccordionTrigger>
            <AccordionContent>
              <div className='px-2'>
                <Slider
                  defaultValue={filters.priceRange}
                  max={250}
                  step={1}
                  className='mt-6'
                  onValueChange={handlePriceChange}
                />
                <div className='flex justify-between mt-2'>
                  <span className='text-sm'>${filters.priceRange[0]}</span>
                  <span className='text-sm'>${filters.priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='color'>
            <AccordionTrigger className='text-lg font-bold !no-underline flex items-center'>
              Filter by Color
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                {colors.map(color => (
                  <div
                    key={color.name}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id={color.name}
                        checked={filters.colors.includes(color.name)}
                        onCheckedChange={() => handleColorChange(color.name)}
                      />
                      <span className='text-sm'>{color.name}</span>
                    </div>
                    <span className='text-sm text-gray-500'>
                      ({color.count})
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='size'>
            <AccordionTrigger className='text-lg font-bold !no-underline flex items-center'>
              Filter by Size
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                {sizes.map(size => (
                  <div
                    key={size.name}
                    className='flex items-center justify-between'
                  >
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
                    <span className='text-sm text-gray-500'>
                      ({size.count})
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className='px-4 pb-4'>
          <Button className='w-full' onClick={updateFilters}>
            Apply Filters
          </Button>
        </div>
      </aside>
    </>
  );
}
