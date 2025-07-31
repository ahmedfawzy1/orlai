import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './styles/globals.css';
import { Navbar } from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './providers/AuthProvider';
import StripeProvider from './providers/StripeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shop Trendy & Elegant Clothing - Orlai',
  description:
    'Discover premium fashion at Orlai - your destination for trendy, sustainable clothing. Find your perfect style with our curated collection of quality garments',
  alternates: {
    canonical: 'https://orlai.store',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StripeProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
        </StripeProvider>
      </body>
    </html>
  );
}
