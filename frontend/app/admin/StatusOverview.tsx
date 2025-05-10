import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { ShoppingCart, RotateCcw, Truck, Check } from 'lucide-react';

const orderStatus = [
  {
    title: 'Total Orders',
    value: 815,
    icon: <ShoppingCart className='w-5 h-5' />,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Orders Pending',
    value: 263,
    icon: <RotateCcw className='w-5 h-5' />,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Orders Processing',
    value: 97,
    icon: <Truck className='w-5 h-5' />,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Orders Delivered',
    value: 418,
    icon: <Check className='w-5 h-5' />,
    color: 'bg-emerald-100 text-emerald-600',
  },
];

export default function StatusOverview() {
  return (
    <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-4'>
      {orderStatus.map(status => (
        <Card key={status.title} className='shadow-sm'>
          <CardHeader className='flex flex-row items-center gap-3 pb-2'>
            <div className={`rounded-full p-3 ${status.color}`}>
              {status.icon}
            </div>
            <div className='flex flex-col'>
              <CardTitle className='text-sm font-medium'>
                {status.title}
              </CardTitle>
              <CardContent className='p-0'>
                <div className='text-xl font-bold'>{status.value}</div>
              </CardContent>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
