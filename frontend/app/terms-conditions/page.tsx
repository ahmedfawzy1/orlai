import generateSEO from '../lib/seo';
import {
  UserCircle2,
  ShoppingCart,
  Copyright,
  Link2,
  Ban,
  FilePenLine,
  Mail,
  ShieldAlert,
  CalendarDays,
  Tag,
  CircleDollarSign,
} from 'lucide-react';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Terms & Conditions | Orlai',
    description:
      'Please read our Terms & Conditions carefully before using our website. These terms govern your use of the Orlai website and services.',
  });
};

const termsSections = [
  {
    icon: UserCircle2,
    title: 'Accounts',
    content:
      'When you create an account, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account.',
  },
  {
    icon: ShoppingCart,
    title: 'Orders',
    content:
      'We reserve the right to refuse or cancel your order at any time for reasons including product availability, errors in description or price, or suspicion of fraudulent activity.',
  },
  {
    icon: Copyright,
    title: 'Intellectual Property',
    content:
      'All content on our website, including text, graphics, logos, and images, is our exclusive property and is protected by international copyright laws.',
  },
  {
    icon: Link2,
    title: 'Links to Other Websites',
    content:
      'Our service may contain links to third-party websites. We have no control over and assume no responsibility for the content or practices of any third-party sites.',
  },
  {
    icon: Ban,
    title: 'Termination',
    content:
      'We may terminate or suspend your account immediately, without prior notice, for any reason, including a breach of these Terms and Conditions.',
  },
  {
    icon: ShieldAlert,
    title: 'Limitation of Liability',
    content:
      'In no event shall Orlai, nor its directors or employees, be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.',
  },
  {
    icon: FilePenLine,
    title: 'Changes to Terms',
    content:
      'We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.',
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content:
      'If you have any questions about these Terms, please contact us through our official channels. We are available to address your concerns.',
  },
];

const returnsSections = [
  {
    icon: CalendarDays,
    title: '30-Day Return Policy',
    content:
      'Items can be returned within 30 days of receipt. Please ensure items are in their original condition to be eligible for a full refund.',
  },
  {
    icon: Tag,
    title: 'Condition of Items',
    content:
      'Returned items must be unworn, unwashed, with all original tags attached. We reserve the right to refuse returns that do not meet these standards.',
  },
  {
    icon: CircleDollarSign,
    title: 'Refund Processing',
    content:
      'Once your return is received and inspected, we will process your refund. The refund will be credited to your original method of payment within 5-7 business days.',
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      <div className='relative h-[40vh] w-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
        <div className='relative z-10 text-center space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-white tracking-tight'>
            Terms & Conditions
          </h1>
          <p className='text-xl text-gray-200 max-w-2xl mx-auto'>
            The rules for using our services.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900'>
            Our Service Agreement
          </h2>
          <div className='w-24 h-1 bg-black mx-auto rounded-full mt-4' />
          <p className='text-lg text-gray-600 mt-6 max-w-3xl mx-auto'>
            By accessing or using our website, you agree to be bound by these
            Terms and Conditions. Please read them carefully.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {termsSections.map((section, index) => (
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

        {/* Returns & Refunds Section */}
        <div className='mt-24'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900'>
              Returns & Refunds Policy
            </h2>
            <div className='w-24 h-1 bg-black mx-auto rounded-full mt-4' />
            <p className='text-lg text-gray-600 mt-6 max-w-3xl mx-auto'>
              We want you to be happy with your purchase. Here are the details
              of our return policy.
            </p>
          </div>

          <div className='grid md:grid-cols-1 lg:grid-cols-3 gap-8'>
            {returnsSections.map((section, index) => (
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
    </div>
  );
}
