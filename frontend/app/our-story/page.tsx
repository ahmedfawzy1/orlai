import React from 'react';
import Image from 'next/image';

export default function OurStory() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative h-[60vh] w-full'>
        <Image
          src='/images/store-front.jpg'
          alt='Our Store Front'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
          <h1 className='text-5xl font-bold text-white'>Our Story</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-16 space-y-16'>
        {/* History Section */}
        <section className='space-y-6'>
          <h2 className='text-3xl font-semibold text-gray-900'>Our Journey</h2>
          <div className='grid md:grid-cols-2 gap-8 items-center'>
            <div className='space-y-4'>
              <p className='text-lg text-gray-600'>
                Founded in 2020, our shop began with a simple yet powerful
                vision: to create a space where quality meets craftsmanship.
                What started as a small boutique has grown into a beloved
                destination for those who appreciate the finer things in life.
              </p>
              <p className='text-lg text-gray-600'>
                Our journey has been marked by countless stories of satisfied
                customers, each one contributing to the rich tapestry of our
                shop's history. From our humble beginnings to becoming a
                cornerstone of the community, we've remained true to our core
                values.
              </p>
            </div>
            <div className='relative h-[400px]'>
              <Image
                src='/images/store-interior.jpg'
                alt='Store Interior'
                fill
                className='object-cover rounded-lg'
              />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className='bg-gray-50 p-8 rounded-lg'>
          <h2 className='text-3xl font-semibold text-gray-900 mb-6'>
            Our Mission
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl'>
            We are committed to providing our customers with exceptional
            products and service, while maintaining the highest standards of
            quality and craftsmanship. Our mission is to create a shopping
            experience that goes beyond the ordinary, where every visit feels
            like coming home.
          </p>
        </section>
      </div>
    </div>
  );
}
