'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
// import { Loader } from 'lucide-react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // if (isCheckingAuth && !authUser) {
  //   return (
  //     <div className='h-screen flex items-center justify-center'>
  //       <Loader className='w-10 h-10 animate-spin' />
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
