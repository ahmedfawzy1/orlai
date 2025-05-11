import { Card } from '@/app/components/ui/card';
import { Layers, RefreshCw, Calendar } from 'lucide-react';

const summaryCards = [
  {
    title: 'Today Orders',
    value: '$897.40',
    icon: <Layers className='w-8 h-8' />,
    color: 'bg-teal-600',
  },
  {
    title: 'Yesterday Orders',
    value: '$679.93',
    icon: <Layers className='w-8 h-8' />,
    color: 'bg-orange-400',
  },
  {
    title: 'This Month',
    value: '$13146.96',
    icon: <RefreshCw className='w-8 h-8' />,
    color: 'bg-blue-500',
  },
  {
    title: 'Last Month',
    value: '$31964.92',
    icon: <Calendar className='w-8 h-8' />,
    color: 'bg-cyan-700',
  },
  {
    title: 'All-Time Sales',
    value: '$626513.05',
    icon: <Calendar className='w-8 h-8' />,
    color: 'bg-emerald-700',
  },
];

export default function SalesOverview() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2 my-6'>
      {summaryCards.map(card => (
        <Card
          key={card.title}
          className={`flex flex-col items-center justify-center h-48 rounded-lg shadow-md p-0 border-0 ${card.color}`}
        >
          <div className='flex flex-col items-center justify-center h-full w-full text-white'>
            <div className='mb-2'>{card.icon}</div>
            <div className='text-lg font-normal mb-1'>{card.title}</div>
            <div className='text-2xl font-bold'>{card.value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
