'use client';

import { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '../lib/axios';
import { useCartStore } from '../store/useCartStore';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleLogin = async (response: any) => {
    try {
      setIsLoading(true);

      await axiosInstance.post('/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { token: response.credential },
        credentials: 'include',
      });

      const cartStore = useCartStore.getState();
      cartStore.clearInvalidItems(); // Clear invalid items first
      await cartStore.syncLocalCartToBackend();

      router.push('/');
      window.location.reload();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId) {
      console.error('Google Client ID is not defined');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleButton') as HTMLElement,
          { theme: 'outline', size: 'large', width: '100%' },
        );
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleClientId]);

  return (
    <div id='googleButton' className='w-full'>
      {isLoading && <LoaderCircle className='animate-spin' />}
    </div>
  );
}
