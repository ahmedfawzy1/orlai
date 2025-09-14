import generateSEO from '../lib/seo';

const jobOpenings = [
  {
    title: 'Fashion Designer',
    location: 'New York, NY',
    type: 'Full-time',
    description:
      'We are looking for a creative Fashion Designer to join our team and help us create stunning new collections.',
  },
  {
    title: 'E-commerce Manager',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Manage our online store, optimize customer experience, and drive sales growth. A passion for fashion is a must.',
  },
  {
    title: 'Marketing Specialist',
    location: 'Los Angeles, CA',
    type: 'Part-time',
    description:
      'Develop and execute marketing campaigns to build our brand presence and engage with our community.',
  },
  {
    title: 'Customer Support Representative',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Be the voice of Orlai and provide exceptional support to our valued customers.',
  },
];

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Careers | Orlai',
    description:
      'Join the Orlai team and help us shape the future of fashion. Explore our open positions and discover a rewarding career with us.',
  });
};

export default function CareersPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      <div className='relative h-[40vh] w-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
        <div className='relative z-10 text-center space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-white tracking-tight'>
            Join Our Team
          </h1>
          <p className='text-xl text-gray-200 max-w-2xl mx-auto'>
            Become a part of our mission to redefine fashion.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-20 space-y-20'>
        <section className='space-y-8 text-center'>
          <h2 className='text-4xl font-bold text-gray-900'>
            Why Work at Orlai?
          </h2>
          <div className='w-24 h-1 bg-black mx-auto rounded-full' />
          <p className='text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto'>
            At Orlai, we believe in fostering a creative and collaborative
            environment where every team member can thrive. We are passionate
            about fashion, innovation, and our community. Join us to make an
            impact in a dynamic and growing company.
          </p>
        </section>

        <section>
          <div className='text-center space-y-4 mb-12'>
            <h2 className='text-4xl font-bold text-gray-900'>Open Positions</h2>
            <div className='w-24 h-1 bg-black mx-auto rounded-full' />
          </div>
          <div className='grid md:grid-cols-2 gap-8'>
            {jobOpenings.map((job, index) => (
              <div
                key={index}
                className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
              >
                <h3 className='text-2xl font-semibold text-gray-900'>
                  {job.title}
                </h3>
                <p className='text-gray-500 mt-1'>
                  {job.location} &middot; {job.type}
                </p>
                <p className='text-gray-600 mt-4'>{job.description}</p>
                <button className='mt-6 bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300'>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
