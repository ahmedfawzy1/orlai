'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useProductStore } from '@/app/store/useProductStore';
import { toast } from 'react-hot-toast';
import { useFilterStore } from '@/app/store/useFilterStore';
import { Product } from '@/app/types/product';
import { Category } from '@/app/types/filter';

interface ClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function Client({
  initialProducts,
  initialCategories,
}: ClientProps) {
  const router = useRouter();
  const { products, deleteProduct, setProducts } = useProductStore();
  const { categories, setCategories } = useFilterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Initialize store with server data
  useEffect(() => {
    setProducts(initialProducts, 1);
    setCategories(initialCategories);
  }, [initialProducts, initialCategories, setProducts, setCategories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(
        product => product.category?.name === categoryFilter,
      );
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
    setSelectedProducts([]);
  };

  // Bulk delete handler
  const handleBulkDeleteProducts = async () => {
    try {
      await Promise.all(selectedProducts.map(id => deleteProduct(id)));
      toast.success('Selected products deleted successfully');
      setSelectedProducts([]);
      router.refresh();
    } catch (error) {
      console.error('Error deleting selected products:', error);
      toast.error('Failed to delete selected products');
    }
  };

  // Selection handlers
  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className='px-4 pt-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Products</h1>
        {selectedProducts.length > 0 && (
          <Button
            variant='destructive'
            onClick={handleBulkDeleteProducts}
            className='h-8'
          >
            Delete Selected ({selectedProducts.length})
          </Button>
        )}
      </div>
      <Card className='py-0'>
        <CardContent className='p-2 md:p-4 flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-center'>
          <Input
            placeholder='Search product...'
            className='w-full md:w-1/2 !ring-0'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className='flex flex-row gap-2 w-full'>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className='w-1/2 md:w-44'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceSort} onValueChange={setPriceSort}>
              <SelectTrigger className='w-1/2 md:w-44'>
                <SelectValue placeholder='Price' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>Low to High</SelectItem>
                <SelectItem value='desc'>High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant='outline'
            className='w-full md:w-auto'
            onClick={handleReset}
          >
            Reset
          </Button>
          <Link
            href='/admin/products/create'
            className='w-full md:w-auto mt-2 md:mt-0 inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 px-4 py-2 rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
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
                  <Checkbox
                    checked={
                      selectedProducts.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    onCheckedChange={handleSelectAllProducts}
                  />
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
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onCheckedChange={checked =>
                        handleSelectProduct(product._id, checked as boolean)
                      }
                    />
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
                  <TableCell>{product?.category?.name}</TableCell>
                  <TableCell>${product.priceRange.minVariantPrice}</TableCell>
                  <TableCell>${product.priceRange.maxVariantPrice}</TableCell>
                  <TableCell>
                    {product.variants.reduce(
                      (total, variant) => total + variant.stock,
                      0,
                    )}
                  </TableCell>
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
                        onClick={() => handleDeleteProduct(product._id)}
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
