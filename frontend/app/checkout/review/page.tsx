import Stepper from '../Stepper';
import ReviewOrder from './ReviewOrder';
import { DiscountSection } from '@/app/components/shop/DiscountSection';

export default function ReviewOrderPage() {
  return (
    <div className='min-h-screen max-w-[1280px] mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div className='md:col-span-2'>
        <h1 className='text-3xl font-semibold mb-6'>Review Your Order</h1>
        <Stepper currentStep={2} />
        <ReviewOrder />
      </div>
      <DiscountSection />
    </div>
  );
}
