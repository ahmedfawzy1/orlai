'use client';

import PageTitle from '../components/Admin/Dashboard/PageTitle';
import SalesOverview from '../components/Admin/Dashboard/SalesOverview';
import StatusOverview from '../components/Admin/Dashboard/StatusOverview';
import DashboardCharts from '../components/Admin/Dashboard/dashboard-charts';
import RecentOrders from '../components/Admin/Dashboard/orders-table';

export default function Dashboard() {
  return (
    <div className='flex h-dvh bg-gray-50'>
      {/* Main Content */}
      <main className='w-full flex-1 py-5'>
        <section>
          <PageTitle>Dashboard Overview</PageTitle>
          <div className='space-y-8 px-4 mb-8'>
            <SalesOverview />
            <StatusOverview />
            <DashboardCharts />
          </div>
        </section>
        <section>
          <PageTitle component='h2'>Recent Orders</PageTitle>
          <RecentOrders />
        </section>
      </main>
    </div>
  );
}
