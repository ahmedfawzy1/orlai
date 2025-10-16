import generateSEO from '../lib/seo';

export const revalidate = 3600;

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Our Story | Orlai',
    description:
      "Learn about Orlai's journey, mission, and commitment to quality, craftsmanship, and community. Discover our story and what sets us apart.",
  });
};

export default function OurStory() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      <div className='relative h-[40vh] w-full bg-gray-900 flex items-center justify-center'>
        <div className='absolute inset-0 bg-gradient-to-r from-black/30 to-blue-600/30' />
        <div className='relative z-10 text-center space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-white tracking-tight'>
            Our Story
          </h1>
          <p className='text-xl text-gray-200 max-w-2xl mx-auto'>
            Crafting excellence since 2025
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-20 space-y-20'>
        <section className='space-y-8'>
          <div className='text-center space-y-4'>
            <h2 className='text-4xl font-bold text-gray-900'>Our Journey</h2>
            <div className='w-24 h-1 bg-black mx-auto rounded-full' />
          </div>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='space-y-6'>
              <p className='text-xl text-gray-600 leading-relaxed'>
                Founded in 2025, our shop began with a simple yet powerful
                vision: to create a space where quality meets craftsmanship.
                What started as a small boutique has grown into a beloved
                destination for those who appreciate the finer things in life.
              </p>
              <p className='text-xl text-gray-600 leading-relaxed'>
                Our journey has been marked by countless stories of satisfied
                customers, each one contributing to the rich tapestry of our
                shop's history. From our humble beginnings to becoming a
                cornerstone of the community, we've remained true to our core
                values.
              </p>
            </div>
            <div className='bg-gradient-to-br from-gray-100 to-blue-100 p-8 rounded-2xl shadow-lg'>
              <div className='space-y-4'>
                <h3 className='text-2xl font-semibold text-gray-900'>
                  Key Milestones
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-center space-x-3'>
                    <span className='w-2 h-2 bg-black rounded-full' />
                    <span className='text-gray-700'>
                      Established our first boutique
                    </span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <span className='w-2 h-2 bg-black rounded-full' />
                    <span className='text-gray-700'>
                      Expanded to multiple locations
                    </span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <span className='w-2 h-2 bg-black rounded-full' />
                    <span className='text-gray-700'>
                      Launched our signature collection
                    </span>
                  </li>
                  <li className='flex items-center space-x-3'>
                    <span className='w-2 h-2 bg-black rounded-full' />
                    <span className='text-gray-700'>
                      Received industry recognition
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className='bg-white p-12 rounded-2xl shadow-xl'>
          <div className='max-w-4xl mx-auto space-y-8'>
            <div className='text-center space-y-4'>
              <h2 className='text-4xl font-bold text-gray-900'>Our Mission</h2>
              <div className='w-24 h-1 bg-black mx-auto rounded-full' />
            </div>
            <p className='text-xl text-gray-600 leading-relaxed text-center'>
              We are committed to providing our customers with exceptional
              products and service, while maintaining the highest standards of
              quality and craftsmanship. Our mission is to create a shopping
              experience that goes beyond the ordinary, where every visit feels
              like coming home.
            </p>
            <div className='grid md:grid-cols-3 gap-8 mt-12'>
              <div className='text-center p-6 bg-gray-50 rounded-xl'>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  Quality
                </h3>
                <p className='text-gray-600'>
                  Uncompromising standards in every detail
                </p>
              </div>
              <div className='text-center p-6 bg-gray-50 rounded-xl'>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  Craftsmanship
                </h3>
                <p className='text-gray-600'>
                  Artisanal excellence in every creation
                </p>
              </div>
              <div className='text-center p-6 bg-gray-50 rounded-xl'>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  Community
                </h3>
                <p className='text-gray-600'>Building lasting relationships</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
