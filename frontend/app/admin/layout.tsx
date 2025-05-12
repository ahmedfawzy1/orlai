'use client';

import Sidebar from '../components/Admin/Dashboard/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex gap-6 h-[calc(100vh-72px)] bg-gray-50'>
      <Sidebar />
      <main className='mb-6 flex-1 overflow-y-auto max-w-[1400px] mx-auto'>
        {children}
      </main>
    </div>
  );
}
