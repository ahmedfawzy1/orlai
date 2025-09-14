import generateSEO from '../lib/seo';
import {
  FileText,
  DatabaseZap,
  ShieldCheck,
  Users,
  PenSquare,
  Mail,
} from 'lucide-react';

export const revalidate = 3600;

const policySections = [
  {
    icon: FileText,
    title: 'Information We Collect',
    content:
      'We may collect personal information from you in a variety of ways, including when you register on the site, place an order, or subscribe to our newsletter. This includes your name, email, shipping address, and payment details.',
  },
  {
    icon: DatabaseZap,
    title: 'How We Use Your Information',
    content:
      'Your information is used to process transactions, improve our website and customer service, and send periodic emails about your order or other products and services we think you might like.',
  },
  {
    icon: ShieldCheck,
    title: 'How We Protect Your Information',
    content:
      'We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure networks and is only accessible by a limited number of authorized personnel.',
  },
  {
    icon: Users,
    title: 'Disclosure to Third Parties',
    content:
      'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except to trusted partners who assist us in operating our website and business.',
  },
  {
    icon: PenSquare,
    title: 'Changes to Our Policy',
    content:
      'If we decide to change our privacy policy, we will post those changes on this page. We recommend you review this policy periodically to stay informed of any updates.',
  },
  {
    icon: Mail,
    title: 'Contacting Us',
    content:
      'If you have any questions regarding this privacy policy, you may contact us using the information on our contact page. We are here to help with any concerns you may have.',
  },
];

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Privacy Policy | Orlai',
    description:
      'Read our Privacy Policy to understand how we collect, use, and protect your personal information. Your privacy is important to us.',
  });
};

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      <div className='relative h-[40vh] w-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
        <div className='relative z-10 text-center space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-white tracking-tight'>
            Privacy Policy
          </h1>
          <p className='text-xl text-gray-200 max-w-2xl mx-auto'>
            Your trust is important to us.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900'>
            Our Commitment to Your Privacy
          </h2>
          <div className='w-24 h-1 bg-black mx-auto rounded-full mt-4' />
          <p className='text-lg text-gray-600 mt-6 max-w-3xl mx-auto'>
            At Orlai, we are dedicated to protecting your personal information
            and handling it responsibly. This policy outlines how we collect,
            use, and safeguard your data.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {policySections.map((section, index) => (
            <div
              key={index}
              className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
            >
              <section.icon className='w-11 h-11 mb-4' />
              <h3 className='text-2xl font-semibold text-gray-900'>
                {section.title}
              </h3>
              <p className='text-gray-600 mt-4'>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
