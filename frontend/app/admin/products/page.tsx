import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';
import { Checkbox } from '@/app/components/ui/checkbox';

export default function ProductsPage() {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Products</h1>
      <Card>
        <CardContent className='flex flex-wrap gap-2 p-4 items-center justify-between'>
          <div className='flex gap-2'>
            <Button variant='outline'>Export</Button>
            <Button variant='outline'>Import</Button>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline'>Bulk Action</Button>
            <Button variant='destructive'>Delete</Button>
            <Button>Add Product</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4 flex flex-wrap gap-2 items-center'>
          <Input placeholder='Search product...' className='w-64' />
          <Select>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='cat1'>Category 1</SelectItem>
              <SelectItem value='cat2'>Category 2</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Price' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='asc'>Low to High</SelectItem>
              <SelectItem value='desc'>High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button>Filter</Button>
          <Button variant='outline'>Reset</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead>PRODUCT NAME</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>SALE PRICE</TableHead>
                <TableHead>STOCK</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>VIEW</TableHead>
                <TableHead>PUBLISHED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(8)].map((_, i) => (
                <TableRow key={i} className='opacity-50'>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-muted rounded-full' />
                      <div className='bg-muted rounded w-24 h-4' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-20 h-4' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-16 h-4' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-16 h-4' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-12 h-4' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-14 h-4' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-8 h-4' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-10 h-4' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted rounded w-16 h-4' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
