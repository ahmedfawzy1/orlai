import { icons } from './icons';

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: keyof typeof icons;
  items?: MenuItem[];
}

export const defaultMenuItems: MenuItem[] = [
  { title: 'Home', url: '/' },
  {
    title: 'Shop',
    url: '/shop',
  },
  {
    title: 'Our Story',
    url: '/our-story',
  },
  {
    title: 'Blog',
    url: '/blog',
  },
  {
    title: 'Contact Us',
    url: '/contact',
  },
];

export const defaultAuthConfig = {
  login: { title: 'Login', url: '/login' },
};

export const defaultLogoConfig = {
  url: '/',
  src: '/images/logo.webp',
  alt: 'logo',
  title: 'orlai',
  width: 70,
  height: 22,
};
