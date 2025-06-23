import { Facebook, Twitter, Instagram } from 'lucide-react';

export const socialHandles = [
  {
    icon: Facebook,
    url: 'https://www.facebook.com/levoire.fashion',
    fill: true,
  },
  {
    icon: Instagram,
    url: 'https://www.instagram.com/levoire_fashion',
    fill: false,
  },
  {
    icon: Twitter,
    url: 'https://x.com/levoire_fashion',
    fill: true,
  },
];

export const footerLinks = [
  {
    title: 'Information',
    links: [
      { href: '/profile', label: 'My Account' },
      { href: '/login', label: 'Login' },
      { href: '/cart', label: 'My Cart' },
      { href: '/wishlist', label: 'My Wishlist' },
      { href: '/profile/orders', label: 'My Orders' },
    ],
  },
  {
    title: 'Services',
    links: [
      {
        href: '/our-story',
        label: 'About Us',
        ariaLabel: 'About Us',
      },
      {
        href: '/careers',
        label: 'Careers',
        ariaLabel: 'Careers',
      },
      {
        href: '/delivery-information',
        label: 'Delivery Information',
        ariaLabel: 'Delivery Information',
      },
      {
        href: '/privacy-policy',
        label: 'Privacy Policy',
        ariaLabel: 'Privacy Policy',
      },
      {
        href: '/terms-conditions',
        label: 'Terms & Conditions',
        ariaLabel: 'Terms and Conditions',
      },
    ],
  },
];
