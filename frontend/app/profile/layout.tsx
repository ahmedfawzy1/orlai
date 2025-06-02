import Sidebar from '../components/Profile/Sidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex gap-6 h-[calc(100vh-72px)] bg-gray-50'>
      <Sidebar />
      <main className='md:mb-6 flex-1 overflow-y-auto max-w-[100rem] mx-auto scrollbar-hide'>
        {children}
      </main>
    </section>
  );
}
