'use client';

import Sidebar from '../components/Admin/Dashboard/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex gap-6 min-h-screen bg-gray-50'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>{children}</main>
    </div>
  );
}
