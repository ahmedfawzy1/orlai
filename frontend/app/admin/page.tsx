'use client';

import PageTitle from './PageTitle';
import SalesOverview from './SalesOverview';
import Sidebar from './Sidebar';
import StatusOverview from './StatusOverview';
import DashboardCharts from './dashboard-charts';
import RecentOrders from './orders-table';

export default function Dashboard() {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className='flex-1 p-8 overflow-y-auto'>
        <section>
          <PageTitle>Dashboard Overview</PageTitle>
          <div className='space-y-8 mb-8'>
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
