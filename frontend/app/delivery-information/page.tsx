import generateSEO from '../lib/seo';
import { Clock, Package, Truck } from 'lucide-react';

export const revalidate = 3600;

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Delivery Information | Orlai',
    description:
      'Find all the details about our shipping options, delivery times, and costs. We ship worldwide to bring fashion to your doorstep.',
  });
};

export default function DeliveryPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      <div className='relative h-[40vh] w-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
        <div className='relative z-10 text-center space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-white tracking-tight'>
            Delivery Information
          </h1>
          <p className='text-xl text-gray-200 max-w-2xl mx-auto'>
            Fast, reliable shipping to your door.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-20 space-y-16'>
        <section>
          <div className='text-center space-y-4 mb-12'>
            <h2 className='text-4xl font-bold text-gray-900'>
              Our Shipping Options
            </h2>
            <div className='w-24 h-1 bg-black mx-auto rounded-full' />
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-8 bg-white rounded-2xl shadow-lg'>
              <Truck className='w-11 h-11 mx-auto mb-4' />
              <h3 className='text-2xl font-semibold text-gray-900'>
                Standard Shipping
              </h3>
              <p className='text-gray-600 mt-2'>5-7 business days</p>
              <p className='text-lg font-bold text-gray-800 mt-4'>$5.00</p>
            </div>
            <div className='text-center p-8 bg-white rounded-2xl shadow-lg'>
              <Package className='w-11 h-11 mx-auto mb-4' />
              <h3 className='text-2xl font-semibold text-gray-900'>
                Express Shipping
              </h3>
              <p className='text-gray-600 mt-2'>2-3 business days</p>
              <p className='text-lg font-bold text-gray-800 mt-4'>$15.00</p>
            </div>
            <div className='text-center p-8 bg-white rounded-2xl shadow-lg'>
              <Clock className='w-11 h-11 mx-auto mb-4' />
              <h3 className='text-2xl font-semibold text-gray-900'>
                Next-Day Shipping
              </h3>
              <p className='text-gray-600 mt-2'>Next business day</p>
              <p className='text-lg font-bold text-gray-800 mt-4'>$25.00</p>
            </div>
          </div>
        </section>

        <section>
          <div className='text-center space-y-4 mb-12'>
            <h2 className='text-4xl font-bold text-gray-900'>
              Frequently Asked Questions
            </h2>
            <div className='w-24 h-1 bg-black mx-auto rounded-full' />
          </div>
          <div className='max-w-4xl mx-auto space-y-6'>
            <div className='bg-white p-6 rounded-xl shadow-md'>
              <h3 className='font-semibold text-lg text-gray-900'>
                Do you ship internationally?
              </h3>
              <p className='text-gray-600 mt-2'>
                Yes, we ship to over 100 countries worldwide. International
                shipping costs and times vary by destination.
              </p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow-md'>
              <h3 className='font-semibold text-lg text-gray-900'>
                How can I track my order?
              </h3>
              <p className='text-gray-600 mt-2'>
                Once your order has shipped, you will receive a confirmation
                email with a tracking number. You can use this number to track
                your package on the carrier's website.
              </p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow-md'>
              <h3 className='font-semibold text-lg text-gray-900'>
                What if my order is delayed?
              </h3>
              <p className='text-gray-600 mt-2'>
                While we strive to meet all delivery times, unforeseen delays
                can occur. Please contact our customer support team if your
                order is taking longer than expected.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
