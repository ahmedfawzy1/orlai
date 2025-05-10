import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

const recentOrders = [
  {
    id: 1,
    customer: 'John Doe',
    product: 'Green Leaf Lettuce',
    status: 'Delivered',
    amount: '$120.00',
    date: '2024-05-10',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    product: 'Clementine',
    status: 'Pending',
    amount: '$80.00',
    date: '2024-05-09',
  },
  {
    id: 3,
    customer: 'Alice Brown',
    product: 'Mint',
    status: 'Processing',
    amount: '$60.00',
    date: '2024-05-08',
  },
  {
    id: 4,
    customer: 'Bob Lee',
    product: 'Rainbow Chard',
    status: 'Delivered',
    amount: '$90.00',
    date: '2024-05-07',
  },
];

export default function RecentOrders() {
  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
