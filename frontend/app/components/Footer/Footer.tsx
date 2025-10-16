import Link from 'next/link';
import Image from 'next/image';
import { footerLinks, socialHandles } from '../../lib/constants';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Input } from '../ui/input';

const socialImages = [
  {
    src: '/images/icons/visa.svg',
    alt: 'visa',
  },
  {
    src: '/images/icons/mastercard.svg',
    alt: 'mastercard',
  },
  {
    src: '/images/icons/google-pay.svg',
    alt: 'google-pay',
  },
  {
    src: '/images/icons/american_express.svg',
    alt: 'american-express',
  },
  {
    src: '/images/icons/paypal.svg',
    alt: 'paypal',
  },
];

export default function Footer() {
  return (
    <footer className='px-5 pt-11 pb-4 bg-[#121117]'>
      <div className='flex justify-between flex-wrap gap-7'>
        <div className='max-w-full md:max-w-60'>
          <Image
            src={'/images/logo.webp'}
            alt='logo'
            width={70}
            height={22}
            className='invert'
          />
          <div className='flex flex-col gap-4 mt-4 md:mt-6'>
            <div className='flex flex-col gap-3'>
              <Link
                href='tel:+17045550127'
                className='flex items-center gap-2 text-white/60 hover:text-white transition'
                aria-label='Phone'
              >
                <Phone size={20} />
                <span>(704) 555-0127</span>
              </Link>
              <Link
                href='mailto:contact@orlai.shop'
                className='flex items-center gap-2 text-white/60 hover:text-white transition'
                aria-label='Email'
              >
                <Mail size={20} />
                <span>contact@orlai.shop</span>
              </Link>
              <Link
                href='https://maps.app.goo.gl/K2rkuRuV2GHSwQfPA'
                target='_blank'
                className='flex items-start gap-2 text-white/60 hover:text-white transition'
                aria-label='Location'
              >
                <MapPin size={20} className='mt-1 flex-shrink-0' />
                <span>580 Grand St. Manhattan, New York 10002</span>
              </Link>
            </div>
          </div>
        </div>
        {footerLinks.map(section => (
          <div key={section.title} className='mb-6'>
            <h3 className='text-white font-medium mb-0 md:mb-3'>
              {section.title}
            </h3>
            <ul>
              {section.links.map(({ label, href }, linkIndex) => (
                <li
                  key={linkIndex}
                  className='text-white/60 leading-9 transition hover:text-white hover:translate-x-1'
                >
                  <Link href={href} prefetch={false}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className='flex flex-col gap-1 mb-6 max-w-80'>
          <h3 className='text-white font-medium mb-0 md:mb-3'>Subscribe</h3>
          <p className='text-white/60 mb-3 md:mb-6'>
            Enter your email below to the first know about new collections and
            product launches.
          </p>
          <div className='relative'>
            <Input
              className='py-5 text-white placeholder:text-white border !border-white rounded-md !ring-0 shadow-none'
              placeholder='Your Email'
              type='email'
              aria-label='Email'
            />
            <button
              className='p-2 absolute right-4 top-1/2 -translate-y-1/2'
              aria-label='Subscribe'
            >
              <ArrowRight size={18} className='text-white' />
            </button>
          </div>
        </div>
      </div>
      <hr className='my-4 border-white/10' />
      <div className='flex flex-wrap flex-col md:flex-row justify-center md:justify-between items-center gap-4'>
        <div className='flex items-center gap-4'>
          {socialImages.map(({ src, alt }, index) => (
            <Image key={index} src={src} alt={alt} width={26} height={26} />
          ))}
        </div>
        <p className='text-white text-sm'>
          &copy; 2025 Orlai. All rights reserved.
        </p>
        <div className='flex items-center gap-4 text-white'>
          {socialHandles.map(({ icon: Icon, url, fill }, index) => (
            <Link
              href={url}
              key={index}
              target='_blank'
              className='transition-transform duration-300 hover:scale-110'
              aria-label={`${Icon} icon`}
            >
              <Icon
                size={20}
                strokeWidth={fill ? 1.5 : 1}
                fill={fill ? '#fff' : 'none'}
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
