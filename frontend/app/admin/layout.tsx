'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Admin/Dashboard/Sidebar';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && (!authUser || authUser.role !== 'admin')) {
      router.push('/');
    }
  }, [authUser, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (!authUser || authUser.role !== 'admin') {
    return null;
  }

  return (
    <section className='flex gap-6 h-[calc(100vh-72px)] bg-gray-50'>
      <Sidebar />
      <main className='md:mb-6 flex-1 overflow-y-auto max-w-[100rem] mx-auto scrollbar-hide'>
        {children}
      </main>
    </section>
  );
}
