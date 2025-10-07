'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!isCheckingAuth) {
      // Check if there's a JWT cookie before making the request
      const hasJwtCookie = document.cookie.includes('jwt=');

      if (hasJwtCookie) {
        checkAuth();
      } else {
        // No JWT cookie, user is definitely not authenticated
        // console.log('No JWT cookie found, skipping auth check');
      }
    }
  }, [checkAuth, isCheckingAuth]);

  return <>{children}</>;
}
