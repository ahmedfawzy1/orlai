import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function OrdersPage() {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Orders</h1>
      <Card className='p-4'>
        <form className='flex flex-col gap-4'>
          {/* First row */}
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <Input
              placeholder='Search by customer name'
              className='w-full md:w-56'
            />
            <Select>
              <SelectTrigger className='w-full md:w-36'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
                <SelectItem value='delivered'>Delivered</SelectItem>
                <SelectItem value='cancel'>Cancel</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className='w-full md:w-36'>
                <SelectValue placeholder='Limit' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>Last 5 days</SelectItem>
                <SelectItem value='7'>Last 7 days</SelectItem>
                <SelectItem value='14'>Last 14 days</SelectItem>
                <SelectItem value='30'>Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className='w-full md:w-36'>
                <SelectValue placeholder='Method' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='card'>Card</SelectItem>
                <SelectItem value='cash'>Cash</SelectItem>
                <SelectItem value='credit'>Credit</SelectItem>
              </SelectContent>
            </Select>
            <div className='flex-1 flex md:justify-end'>
              <Button
                type='button'
                className='w-full md:w-auto h-9 bg-green-600 hover:bg-green-700'
              >
                Download
              </Button>
            </div>
          </div>
          {/* Second row */}
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className='flex flex-col w-full md:w-1/2'>
              <label className='mb-1 text-sm font-medium text-muted-foreground'>
                Start date
              </label>
              <Input type='date' placeholder='Pick a date' className='w-full' />
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
              <label className='mb-1 text-sm font-medium text-muted-foreground'>
                End date
              </label>
              <Input type='date' placeholder='Pick a date' className='w-full' />
            </div>
            <div className='flex items-end gap-4 w-full md:w-auto'>
              <Button type='submit' className='w-full md:w-auto h-9'>
                Filter
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='w-full md:w-auto h-9'
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Card>
      <Card className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>INVOICE NO</TableHead>
              <TableHead>ORDER TIME</TableHead>
              <TableHead>CUSTOMER NAME</TableHead>
              <TableHead>METHOD</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTION</TableHead>
              <TableHead>INVOICE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(7)].map((_, i) => (
              <TableRow key={i}>
                {Array(8)
                  .fill(0)
                  .map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className='h-6 w-full' />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
