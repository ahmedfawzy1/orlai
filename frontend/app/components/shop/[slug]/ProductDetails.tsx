'use client';

import { useState } from 'react';
import { useWishlistStore } from '@/app/store/useWishlistStore';
import { Product } from '@/app/types/product';
import { Heart, Loader2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactStars from 'react-rating-star-with-type';

export default function ProductDetails({
  product,
  userId,
}: {
  product: Product;
  userId: string;
}) {
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useWishlistStore();
  const [selectedColor, setSelectedColor] = useState<any>(
    product.variants.length > 0 && product.variants[0]?.color
      ? product.variants[0].color.hexCode
      : null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0]?.size.name : null,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select a color and size');
      return;
    }
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
    toast.success('Product added to cart');
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error('Please login to add items to your wishlist');
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(userId, product._id);
        toast.success('Product removed from wishlist');
      } else {
        await addToWishlist(userId, product._id);
        toast.success('Product added to wishlist');
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error.response.data);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex-1 max-w-xl'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl md:text-3xl font-bold'>{product.name}</h1>
        {product.availableForSale && product.inventory > 0 ? (
          <span className='bg-green-100 text-green-800 font-medium text-xs md:mb-2 inline-block rounded px-3 py-1.5'>
            In Stock
          </span>
        ) : (
          <span className='bg-red-100 text-red-500 font-medium text-xs md:mb-2 inline-block rounded px-3 py-1.5'>
            Out of Stock
          </span>
        )}
      </div>
      <div className='text-lg md:text-xl md:my-2'>
        {product.category?.name || 'Uncategorized'}
      </div>
      <div className='flex items-center gap-2 mb-2'>
        <span className='text-orange-400 text-xl'>
          <ReactStars
            value={product.averageRating}
            isEdit={false}
            activeColors={['red', 'orange', '#FFCE00', '#9177FF', '#FFC633']}
          />
        </span>
        <span className='text-gray-500'>
          {product.averageRating.toFixed(1)} ({product.reviews.length} Reviews)
        </span>
      </div>
      <div className='flex items-center gap-2 mb-2'>
        <span className='text-[22px] text-black-500'>
          $
          {Number.isInteger(product.priceRange.minVariantPrice)
            ? product.priceRange.minVariantPrice.toFixed(2)
            : product.priceRange.minVariantPrice}
        </span>
        <span className='text-[22px] text-gray-500 line-through'>
          $
          {Number.isInteger(product.priceRange.maxVariantPrice)
            ? product.priceRange.maxVariantPrice.toFixed(2)
            : product.priceRange.maxVariantPrice}
        </span>
      </div>

      <p className='my-2 md:my-4 text-gray-900 font-semibold'>
        {product.description}
      </p>
      <div className='mb-4'>
        <div className='text-xl font-bold mb-2'>Color</div>
        <div className='flex gap-3'>
          {product.variants
            .filter((variant: any) => variant.color !== null)
            .map((variant: any) => (
              <button
                key={variant._id}
                title={variant.color.name}
                className={`relative inline-block w-8 h-8 rounded-sm cursor-pointer border-2 ${
                  selectedColor === variant.color.hexCode
                    ? 'border-black/50'
                    : 'border-transparent'
                }`}
                style={{ background: variant.color.hexCode }}
                onClick={() => setSelectedColor(variant.color.hexCode)}
              >
                {selectedColor === variant.color.hexCode && (
                  <Check className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-5 h-5' />
                )}
              </button>
            ))}
        </div>
      </div>
      <div className='mb-4'>
        <div className='text-xl font-bold mb-2'>Size</div>
        <div className='flex gap-3'>
          {product.variants.map((variant: any) => (
            <button
              key={variant._id}
              className={`px-4 py-2 border rounded-sm font-medium cursor-pointer transition-colors duration-150 border-gray-900 ${
                selectedSize === variant.size.name
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedSize(variant.size.name)}
            >
              {variant.size.name}
            </button>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-4 mt-6'>
        <div className='flex items-center border border-black rounded-lg'>
          <button
            className='px-4 py-2.5 md:py-3 text-xl border-none bg-transparent cursor-pointer'
            onClick={() => setQuantity(quantity - 1)}
          >
            -
          </button>
          <span className='px-4 text-lg'>{quantity}</span>
          <button
            className='px-4 py-2.5 md:py-3 text-xl border-none bg-transparent cursor-pointer'
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
        <button
          className='flex-1 bg-gray-900 text-white font-semibold text-lg py-2.5 md:py-3 rounded-lg border-none cursor-pointer transition-colors duration-300 hover:bg-gray-800'
          disabled={!product.availableForSale || product.inventory === 0}
          onClick={() => handleAddToCart()}
          aria-label='Add to Cart'
        >
          Add to Cart
        </button>
        <button
          onClick={e => handleAddToWishlist(e)}
          className={`border-1 border-black rounded-md w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isInWishlist(product._id)
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-transparent hover:bg-gray-100'
          }`}
          aria-label='Add to Wishlist'
        >
          {isLoading ? (
            <Loader2 size={20} className='animate-spin' />
          ) : (
            <Heart size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
