'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';
import { Checkbox } from '@/app/components/ui/checkbox';
import Link from 'next/link';
import { useProductStore } from '@/app/store/useProductStore';

export default function ProductsPage() {
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('');

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return Array.from(uniqueCategories);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }

    // Apply price sorting
    if (priceSort) {
      result.sort((a, b) => {
        const priceA = a.priceRange.minVariantPrice;
        const priceB = b.priceRange.minVariantPrice;
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [products, searchQuery, categoryFilter, priceSort]);

  const handleReset = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceSort('');
  };

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Products</h1>
      <Card className='py-0'>
        <CardContent className='p-4 flex flex-nowrap gap-2 items-center'>
          <Input
            placeholder='Search product...'
            className='w-full !ring-0'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='w-44'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className='w-44'>
              <SelectValue placeholder='Price' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='asc'>Low to High</SelectItem>
              <SelectItem value='desc'>High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' onClick={handleReset}>
            Reset
          </Button>
          <Link
            href='/admin/products/create'
            className='inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 px-4 py-2 rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
          >
            Add Product
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead>PRODUCT NAME</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>Min PRICE</TableHead>
                <TableHead>STOCK</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>VIEW</TableHead>
                <TableHead>PUBLISHED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          className='w-6 h-6 rounded-full object-cover'
                          width={24}
                          height={24}
                        />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.priceRange.minVariantPrice}</TableCell>
                  <TableCell>${product.priceRange.maxVariantPrice}</TableCell>
                  <TableCell>{product.inventory}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.availableForSale
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.availableForSale ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/products/${product.slug}`}
                      className='text-blue-600 hover:underline'
                    >
                      View
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.availableForSale
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.availableForSale ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className='text-blue-600 hover:underline'
                      >
                        Edit
                      </Link>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600'
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
