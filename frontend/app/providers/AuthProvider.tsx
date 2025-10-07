'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
// import { Loader } from 'lucide-react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current && !isCheckingAuth) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, [checkAuth, isCheckingAuth]);

  return <>{children}</>;
}
