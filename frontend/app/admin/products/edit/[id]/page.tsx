'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosInstance } from '@/app/lib/axios';
import { useFilterStore } from '@/app/store/useFilterStore';
import { ChevronDown, LoaderCircle, PackagePlus, X } from 'lucide-react';
import Size from '@/app/components/Admin/Products/Size';
import Color from '@/app/components/Admin/Products/Color';
import ImageGallery from '@/app/components/Admin/Products/ImageGallery';
import toast from 'react-hot-toast';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { categories, sizes, colors, getFilters } = useFilterStore();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const defaultImage =
    'https://res.cloudinary.com/dr0gslecu/image/upload/v1730150154/lvfef1ettpmxxvvk6gtz.png';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priceRange: { maxVariantPrice: 0, minVariantPrice: 0 },
    image: [] as string[],
    variants: [] as { color: string; size: string; stock: number }[],
    slug: '',
  });

  const [currentVariant, setCurrentVariant] = useState({
    color: '',
    size: '',
    stock: 0,
  });

  const FormSchema = z.object({
    name: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters long')
      .max(1000, 'Description cannot exceed 1000 characters'),
    category: z.string().min(2, 'Please select a category'),
    priceRange: z.object({
      maxVariantPrice: z
        .number()
        .positive()
        .min(1, 'Price must be at least 1')
        .max(10000, 'Price cannot exceed 10,000'),
      minVariantPrice: z
        .number()
        .positive()
        .min(1, 'Price must be at least 1')
        .max(10000, 'Price cannot exceed 10,000'),
    }),
    variants: z.array(
      z.object({
        color: z.string().min(1, 'Color is required'),
        size: z.string().min(1, 'Size is required'),
        stock: z.number().min(1, 'Stock must be at least 1'),
      }),
    ),
    image: z.array(z.string()),
    slug: z
      .string()
      .min(3, 'Slug must be at least 3 characters long')
      .max(100, 'Slug cannot exceed 100 characters'),
  });

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    getFilters();
  }, [getFilters]);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        const product = response.data.data;

        // Handle priceRange
        const priceRange =
          product.priceRange &&
          typeof product.priceRange === 'object' &&
          !Array.isArray(product.priceRange)
            ? product.priceRange
            : Array.isArray(product.priceRange) && product.priceRange.length > 0
              ? product.priceRange[0]
              : { maxVariantPrice: 0, minVariantPrice: 0 };

        // Handle category
        const categoryName =
          typeof product.category === 'object'
            ? product.category?.name
            : product.category || '';

        // Normalize variants to use IDs instead of populated objects
        const normalizedVariants = (product.variants || []).map(
          (variant: any) => ({
            color:
              typeof variant.color === 'object' && variant.color?._id
                ? variant.color._id
                : variant.color || '',
            size:
              typeof variant.size === 'object' && variant.size?._id
                ? variant.size._id
                : variant.size || '',
            stock: variant.stock || 0,
          }),
        );

        setFormData({
          name: product.name || '',
          description: product.description || '',
          category: categoryName,
          priceRange: priceRange,
          image: product.images || [],
          variants: normalizedVariants,
          slug: product.slug || '',
        });

        setImageUrls(product.images || []);

        reset({
          name: product.name || '',
          description: product.description || '',
          category: categoryName,
          priceRange: priceRange,
          image: product.images || [],
          variants: normalizedVariants,
          slug: product.slug || '',
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product data');
      }
    };

    fetchProduct();
  }, [id, reset]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (
      name === 'name' ||
      name === 'category' ||
      name === 'description' ||
      name === 'slug'
    ) {
      register(name).onChange(e);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const price = e.target.value !== '' ? parseFloat(value) : 0;
    setFormData(prevFormData => ({
      ...prevFormData,
      priceRange: {
        maxVariantPrice: price,
        minVariantPrice: prevFormData.priceRange.minVariantPrice,
      },
    }));
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const price = e.target.value !== '' ? parseFloat(value) : 0;
    setFormData(prevFormData => ({
      ...prevFormData,
      priceRange: {
        maxVariantPrice: prevFormData.priceRange.maxVariantPrice,
        minVariantPrice: price,
      },
    }));
  };

  const handleImageChange = (imageUrls: string[]) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      image: imageUrls,
    }));
  };

  const handleVariantChange = (field: string, value: string | number) => {
    setCurrentVariant(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addVariant = () => {
    if (
      !currentVariant.color ||
      !currentVariant.size ||
      currentVariant.stock <= 0
    ) {
      toast.error('Please fill all variant fields');
      return;
    }

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, currentVariant],
    }));
    setValue('variants', [...formData.variants, currentVariant]);
    trigger('variants');

    setCurrentVariant({
      color: '',
      size: '',
      stock: 0,
    });
  };

  const removeVariant = (index: number) => {
    setFormData(prev => {
      const newVariants = prev.variants.filter((_, i) => i !== index);
      setValue('variants', newVariants);
      return { ...prev, variants: newVariants };
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (imageUrls.length === 0) {
        setFormData(prevFormData => ({
          ...prevFormData,
          image: [defaultImage],
        }));
      }

      const categoryId =
        categories.find(c => c.name === formData.category)?._id ||
        formData.category;
      const { maxVariantPrice, minVariantPrice } = formData.priceRange;
      const priceRange = [{ maxVariantPrice, minVariantPrice }];

      const images = formData.image;

      const transformedVariants = formData.variants.map(variant => {
        // Helper function to get ID from size (string ID, object with _id, or object with name)
        const getSizeId = (size: string | any): string => {
          // If already a valid MongoDB ObjectId string (24 hex chars)
          if (typeof size === 'string' && /^[0-9a-fA-F]{24}$/.test(size)) {
            return size;
          }

          if (typeof size === 'object' && size) {
            // Object with _id field
            if ('_id' in size && size._id) {
              return size._id;
            }
            // Object with name field - find the ID
            if ('name' in size && size.name) {
              const foundSize = sizes.find(s => s.name === size.name);
              if (foundSize?._id) {
                return foundSize._id;
              }
            }
          }

          console.error('Could not determine size ID for:', size);
          throw new Error(`Invalid size: ${JSON.stringify(size)}`);
        };

        // Helper function to get ID from color
        const getColorId = (color: string | any): string => {
          console.log('Getting color ID for:', color, typeof color);

          if (!color) {
            throw new Error('Color is required');
          }

          // If already a valid MongoDB ObjectId string (24 hex chars)
          if (typeof color === 'string' && /^[0-9a-fA-F]{24}$/.test(color)) {
            console.log('Color is already an ID:', color);
            return color;
          }

          if (typeof color === 'object' && color) {
            // Object with _id field
            if ('_id' in color && color._id) {
              console.log('Color has _id:', color._id);
              return color._id;
            }
            // Object with name field - find the ID
            if ('name' in color && color.name) {
              const foundColor = colors.find(c => c.name === color.name);
              console.log(
                `Looking up color by name "${color.name}":`,
                foundColor,
              );
              if (foundColor?._id) {
                return foundColor._id;
              }
            }
          }

          console.error('Could not determine color ID for:', color);
          throw new Error(`Invalid color: ${JSON.stringify(color)}`);
        };

        const transformedVariant: any = {
          size: getSizeId(variant.size),
          color: getColorId(variant.color),
          stock: variant.stock,
        };

        return transformedVariant;
      });

      const payload = {
        name: formData.name,
        description: formData.description,
        category: categoryId,
        priceRange,
        images,
        variants: transformedVariants,
        slug: formData.slug,
      };

      await axiosInstance.put(`/products/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Product updated successfully');
      setIsLoading(false);
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to update product:', error);

      // Show detailed error message
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to update product: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  //  get names from ObjectIds or objects
  const getSizeName = (size: string | any) => {
    // If size is already an object with name
    if (typeof size === 'object' && size?.name) {
      return size.name;
    }
    // If size is an ID string
    if (typeof size === 'string') {
      const sizeObj = sizes.find(s => s._id === size);
      return sizeObj?.name || size;
    }
    return '';
  };

  const getColorHex = (color: string | any) => {
    if (!color) return '';
    // If color is already an object with hexCode
    if (typeof color === 'object' && color?.hexCode) {
      return color.hexCode;
    }
    // If color is an ID string
    if (typeof color === 'string') {
      const colorObj = colors.find(c => c._id === color);
      return colorObj?.hexCode || '#000000';
    }
    return '#000000';
  };

  return (
    <div className='mb-10 pe-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-sm md:text-2xl font-semibold py-6 flex justify-center items-center gap-2'>
          <PackagePlus />
          Edit Product
        </h1>
        <button
          type='button'
          onClick={() => {
            onSubmit();
          }}
          disabled={isLoading}
          className='px-3 py-2 bg-black text-white text-sm md:text-base rounded-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <>Update Product</>
          )}
        </button>
      </div>
      <div className='text-black mt-2'>
        <form id='product-form' className='flex flex-col md:flex-row gap-6'>
          <div className='flex flex-col basis-3/5'>
            <div className='bg-[#f9f9f9] p-5 pt-0 space-y-5 rounded-2xl'>
              <h2 className='text-xl font-bold mb-4'>General Information</h2>
              <div>
                <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                  Product Name
                </label>
                <input
                  id='name'
                  type='text'
                  {...register('name')}
                  value={formData.name}
                  onChange={handleChange}
                  className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name?.message}</p>
                )}
              </div>
              <div>
                <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                  Product Description
                </label>
                <textarea
                  className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg resize-none focus:outline-none'
                  value={formData.description}
                  onChange={e =>
                    handleChange({
                      target: { name: 'description', value: e.target.value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  placeholder='Describe your product'
                  rows={5}
                />
                {errors.description && (
                  <p className='text-red-500 text-sm'>
                    {errors.description?.message}
                  </p>
                )}
              </div>
              <div className='flex gap-3'>
                <div className='w-full'>
                  <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                    Category
                  </label>
                  <div className='relative'>
                    <select
                      id='category'
                      {...register('category')}
                      value={formData.category}
                      onChange={handleChange}
                      className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none appearance-none pr-10'
                    >
                      <option value=''>Select a category</option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <span className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2'>
                      <ChevronDown size={19} />
                    </span>
                  </div>
                  {errors.category && (
                    <p className='text-red-500 text-sm'>
                      {errors.category?.message}
                    </p>
                  )}
                </div>
                <div className='w-full'>
                  <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                    Slug
                  </label>
                  <input
                    id='slug'
                    type='text'
                    {...register('slug')}
                    value={formData.slug}
                    onChange={handleChange}
                    className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none'
                  />
                  {errors.slug && (
                    <p className='text-red-500 text-sm'>
                      {errors.slug?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='bg-[#f9f9f9] p-5 space-y-5 rounded-2xl'>
              <h3 className='text-xl font-bold mb-4'>Pricing</h3>
              <div className='flex gap-3'>
                <div className='w-full'>
                  <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                    Price
                  </label>
                  <input
                    id='maxPrice'
                    type='number'
                    {...register('priceRange.maxVariantPrice', {
                      valueAsNumber: true,
                      onChange: handleMaxPriceChange,
                    })}
                    value={
                      formData.priceRange.maxVariantPrice === 0
                        ? ''
                        : formData.priceRange.maxVariantPrice.toString()
                    }
                    min={1}
                    className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none'
                  />
                  {errors.priceRange?.maxVariantPrice && (
                    <p className='text-red-500 text-sm'>
                      {errors.priceRange.maxVariantPrice.message}
                    </p>
                  )}
                </div>
                <div className='w-full'>
                  <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                    Min Price
                  </label>
                  <input
                    id='minPrice'
                    type='number'
                    {...register('priceRange.minVariantPrice', {
                      valueAsNumber: true,
                      onChange: handleMinPriceChange,
                    })}
                    value={
                      formData.priceRange.minVariantPrice === 0
                        ? ''
                        : formData.priceRange.minVariantPrice.toString()
                    }
                    min={1}
                    className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none'
                  />
                  {errors.priceRange?.minVariantPrice && (
                    <p className='text-red-500 text-sm'>
                      {errors.priceRange.minVariantPrice.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='bg-[#f9f9f9] p-5 rounded-2xl space-y-4'>
              <h3 className='text-xl font-bold'>Variants</h3>
              <div className='flex gap-3'>
                <div className='w-full'>
                  <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                    Size
                  </label>
                  <input
                    id='size'
                    type='text'
                    value={getSizeName(currentVariant.size)}
                    onChange={handleChange}
                    disabled
                    className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none mb-2.5'
                  />
                  <Size
                    selectedSize={currentVariant.size}
                    onSizeChange={size => handleVariantChange('size', size)}
                  />
                </div>
                <div className='w-full'>
                  <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                    Color
                  </label>
                  <input
                    id='color'
                    type='text'
                    value={getColorHex(currentVariant.color)}
                    onChange={handleChange}
                    disabled
                    className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none mb-2.5'
                  />
                  <Color
                    selectedColor={currentVariant.color}
                    onColorChange={color => handleVariantChange('color', color)}
                  />
                </div>
              </div>
              <div className='w-full'>
                <label className='text-[15px] font-medium text-gray-900 block mb-2'>
                  Stock
                </label>
                <input
                  type='number'
                  value={currentVariant.stock || ''}
                  onChange={e =>
                    handleVariantChange('stock', parseInt(e.target.value) || 0)
                  }
                  min={0}
                  className='bg-[#efefef] block w-full px-2.5 py-2.5 rounded-lg focus:outline-none'
                />
              </div>
              <button
                type='button'
                onClick={addVariant}
                className='px-3 py-2 mt-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200'
              >
                Add Variant
              </button>

              {formData.variants.length > 0 && (
                <div className='mt-4'>
                  <h4 className='text-lg font-semibold mb-3'>Added Variants</h4>
                  <div className='space-y-2'>
                    {formData.variants.map((variant, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between bg-white p-3 rounded-md shadow-sm'
                      >
                        <div className='flex items-center gap-4'>
                          {variant.color && (
                            <div
                              className='w-6 h-6 rounded-full border'
                              style={{
                                backgroundColor: getColorHex(variant.color),
                              }}
                            />
                          )}
                          <span className='font-medium'>
                            {getSizeName(variant.size)}
                          </span>
                          <span className='text-gray-600'>
                            Stock: {variant.stock}
                          </span>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeVariant(index)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='bg-[#f9f9f9] h-fit p-5 space-y-5 rounded-2xl basis-2/5'>
            <h4 className='text-xl font-bold mb-4'>Product Images</h4>
            <ImageGallery
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              handleImageChange={handleImageChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
