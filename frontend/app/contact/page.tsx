import generateSEO from '../lib/seo';

export const revalidate = 3600;

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Contact Us | Orlai',
    description:
      'Have a question or want to work together? Contact Orlai for support, collaboration, or general inquiries. We would love to hear from you!',
  });
};

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
            Contact Us
          </h1>
          <p className='mt-4 text-lg text-gray-600'>
            Have a question or want to work together? We'd love to hear from
            you.
          </p>
        </div>

        <div className='mt-12 bg-white shadow-lg rounded-lg p-4 md:p-8'>
          <form className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Name
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='px-3 py-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-visible:outline-none'
                  placeholder='Your name'
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='px-3 py-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-visible:outline-none'
                  placeholder='email@example.com'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='subject'
                className='block text-sm font-medium text-gray-700'
              >
                Subject
              </label>
              <input
                type='text'
                name='subject'
                id='subject'
                className='px-3 py-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-visible:outline-none'
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-700'
              >
                Message
              </label>
              <textarea
                id='message'
                name='message'
                rows={4}
                className='px-3 py-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-visible:outline-none'
                placeholder='Your message here...'
              />
            </div>

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors duration-300'
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
