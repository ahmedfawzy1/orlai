'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/app/types/product';
import { NewReview } from '@/app/types/review';
import { useSession } from 'next-auth/react';
import { useReviewStore } from '@/app/store/useReviewStore';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/tabs';
import { CircleUser, X, Check } from 'lucide-react';
import ReactStars from 'react-rating-star-with-type';
import toast from 'react-hot-toast';

export default function TabMenu({ product }: { product: Product }) {
  const [showReviewBox, setShowReviewBox] = useState(false);
  const {
    reviews,
    getProductReviews,
    createReview,
    checkCanReview,
    reviewStatus,
    isLoading,
    error,
  } = useReviewStore();
  const { data: session } = useSession();
  const [newReview, setNewReview] = useState<NewReview>({
    name: '',
    email: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (product?._id) {
      getProductReviews(product._id);
    }
  }, [product?._id, getProductReviews]);

  useEffect(() => {
    if (product?._id && session?.user) {
      checkCanReview(product._id);
    }
  }, [product?._id, session?.user, checkCanReview]);

  useEffect(() => {
    if (showReviewBox && session?.user) {
      setNewReview(prev => ({
        ...prev,
        name: `${session.user.first_name} ${session.user.last_name}`.trim(),
        email: session.user.email || '',
      }));
    } else if (!showReviewBox) {
      setNewReview({ name: '', email: '', rating: 5, comment: '' });
    }
  }, [showReviewBox, session?.user]);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('Please login to write a review');
      return;
    }
    if (!product?._id) {
      console.error('Product ID is missing');
      return;
    }
    try {
      await createReview(product._id, newReview);
      setNewReview({
        name: '',
        email: '',
        rating: 5,
        comment: '',
      });
      setShowReviewBox(false);
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to submit review. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleReviewButtonClick = () => {
    if (!session?.user) {
      toast.error('Please login to write a review');
      return;
    }

    if (!reviewStatus?.canReview) {
      toast.error(reviewStatus?.message || 'You cannot review this product');
      return;
    }

    setShowReviewBox(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!product?._id) {
    return null;
  }

  return (
    <Tabs defaultValue='description' className='w-full mt-8'>
      <TabsList className='mb-2 w-fit md:w-full h-auto gap-2 border-b border-gray-200 bg-transparent p-0 rounded-none overflow-x-auto'>
        <TabsTrigger
          value='description'
          className='px-0 py-2 h-auto border-b-2 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-black border-transparent !shadow-none !outline-0 rounded-none text-base'
        >
          Descriptions
        </TabsTrigger>
        <TabsTrigger
          value='additional'
          className='px-0 py-2 h-auto border-b-2 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-black border-transparent !shadow-none !outline-0 rounded-none text-base'
        >
          Additional Information
        </TabsTrigger>
        <TabsTrigger
          value='reviews'
          className='px-0 py-2 h-auto border-b-2 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-black border-transparent !shadow-none !outline-0 rounded-none text-base'
        >
          Reviews ({reviews?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value='description' className='pt-1'>
        <p className='text-gray-700 text-base mb-4'>{product.description}</p>
      </TabsContent>

      <TabsContent value='additional' className='pt-1'>
        <div className='flex flex-col gap-2 md:gap-4'>
          <div className='flex items-start gap-8'>
            <span className='font-semibold text-base min-w-[80px]'>Color</span>
            <span className='text-gray-700 text-base'>
              {product.variants
                .filter((variant: any) => variant.color !== null)
                .map((variant: any) => variant.color.name)
                .join(', ')}
            </span>
          </div>
          <div className='flex items-start gap-8'>
            <span className='font-semibold text-base min-w-[80px]'>Size</span>
            <span className='text-gray-700 text-base'>
              {product.variants
                .map((variant: any) => variant.size.name)
                .join(', ')}
            </span>
          </div>
        </div>
      </TabsContent>

      <TabsContent value='reviews' className='w-full pt-1'>
        {/* Review Form Trigger */}
        <div className='w-full flex justify-between items-center'>
          <h3 className='text-lg md:text-xl font-bold'>Customer Reviews</h3>
          <button
            className={`text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
              reviewStatus?.canReview
                ? 'bg-black text-white hover:bg-gray-800 focus:ring-black'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleReviewButtonClick}
            disabled={showReviewBox || !reviewStatus?.canReview}
          >
            {reviewStatus?.hasReviewed ? 'Already Reviewed' : 'Write a Review'}
          </button>
        </div>

        {/* Reviews List */}
        <div className='w-full pt-3 pb-2 flex gap-3 overflow-x-auto'>
          {error && <div className='text-red-500 mb-4'>{error}</div>}
          {showReviewBox && (
            <form
              onSubmit={handleSubmitReview}
              className='min-w-[315px] px-5 pt-3 pb-5 border border-gray-200 rounded-lg shadow-sm'
            >
              <div className='mb-3 flex items-center gap-2'>
                <CircleUser size={40} strokeWidth={1.2} />
                <div className='flex flex-col gap-0.5'>
                  {session?.user ? (
                    <span className='font-semibold text-nowrap'>
                      {`${session.user.first_name} ${session.user.last_name}`.trim()}
                    </span>
                  ) : (
                    <input
                      type='text'
                      placeholder='Your Name'
                      value={newReview.name}
                      onChange={e =>
                        setNewReview({ ...newReview, name: e.target.value })
                      }
                      className='font-semibold text-nowrap bg-transparent border-b border-gray-300 focus:outline-none focus:border-black w-32'
                      required
                    />
                  )}
                  <span className='text-yellow-500'>
                    <ReactStars
                      count={5}
                      value={newReview.rating}
                      onChange={value =>
                        setNewReview({ ...newReview, rating: value })
                      }
                      size={16}
                      activeColor='#ffd700'
                      isEdit={true}
                    />
                  </span>
                </div>
                <div className='ml-auto flex self-start'>
                  <button
                    type='button'
                    aria-label='Cancel review'
                    onClick={() => setShowReviewBox(false)}
                    className='p-1 rounded hover:bg-gray-100 focus:outline-none'
                  >
                    <X size={18} />
                  </button>
                  <button
                    type='submit'
                    aria-label='Submit review'
                    disabled={isLoading}
                    className='p-1 rounded hover:bg-gray-100 focus:outline-none disabled:opacity-50'
                  >
                    <Check size={18} />
                  </button>
                </div>
              </div>
              <div>
                <input
                  type='text'
                  placeholder='Write your review...'
                  value={newReview.comment}
                  onChange={e =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className='text-black text-base mb-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-black w-full'
                  required
                />
                <div className='text-xs text-gray-400'>
                  Review by{' '}
                  <span className='text-black font-semibold'>
                    {session?.user
                      ? `${session.user.first_name} ${session.user.last_name}`.trim()
                      : newReview.name || 'Your Name'}
                  </span>{' '}
                  | Posted on{' '}
                  <span className='text-black font-semibold'>{todayDate}</span>
                </div>
              </div>
            </form>
          )}
          {(!reviews || reviews.length === 0) && !showReviewBox ? (
            <p className='text-gray-500'>
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            reviews?.map(review => (
              <div
                key={review._id}
                className='min-w-[315px] px-5 pt-3 pb-5 border border-gray-200 rounded-lg shadow-sm'
              >
                <div className='mb-3 flex items-center gap-2'>
                  <CircleUser size={40} strokeWidth={1.2} />
                  <div className='flex flex-col gap-0.5'>
                    <span className='font-semibold text-nowrap'>
                      {review.name}
                    </span>
                    <span className='text-yellow-500'>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={16}
                        activeColor='#ffd700'
                      />
                    </span>
                  </div>
                </div>
                <div>
                  <p className='text-black text-base mb-2'>{review.comment}</p>
                  <div className='text-xs text-gray-400'>
                    Review by{' '}
                    <span className='text-black font-semibold'>
                      {review.name}
                    </span>{' '}
                    | Posted on{' '}
                    <span className='text-black font-semibold'>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
