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
  title: 'lustria',
  description:
    'Lustria offers a wide variety of stylish and high-quality clothing for every occasion. Discover the latest fashion trends with curated collections for men, women, and kids. Shop now for unique pieces that elevate your wardrobe, delivered right to your doorstep with easy returns and excellent customer service.',
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
