import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Order } from '@/app/store/useOrderStore';
import { formatDate } from '@/app/lib/utils';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold tracking-tight'>
            Order Details
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-8'>
          {order.customer && (
            <div>
              <h3 className='text-lg font-semibold mb-3'>
                Customer Information
              </h3>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <span className='font-medium text-muted-foreground'>Name:</span>
                <span>
                  {order.customer.first_name} {order.customer.last_name}
                </span>
                <span className='font-medium text-muted-foreground'>
                  Email:
                </span>
                <span className='break-all text-muted-foreground'>
                  {order.customer.email}
                </span>
                <span className='font-medium text-muted-foreground'>
                  Customer ID:
                </span>
                <span className='break-all text-gray-600'>
                  {order.customer._id}
                </span>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-3'>Order Information</h3>
              <div className='space-y-1 text-sm'>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Order ID:
                  </span>{' '}
                  <span className='break-all'>{order._id}</span>
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Date:
                  </span>{' '}
                  {formatDate(order.createdAt)}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Status:
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                      order.orderStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Payment Method:
                  </span>{' '}
                  {order.paymentMethod}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Payment Status:
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                      order.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentMethod === 'card' && order.paymentDetails && (
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      Card:
                    </span>{' '}
                    {order.paymentDetails.cardType} ending in{' '}
                    {order.paymentDetails.last4}
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      Tracking Number:
                    </span>{' '}
                    {order.trackingNumber}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-3'>Shipping Address</h3>
              <div className='space-y-1 text-sm'>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Name:
                  </span>{' '}
                  {order.shippingAddress.name}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Phone:
                  </span>{' '}
                  {order.shippingAddress.phone}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Address:
                  </span>{' '}
                  {order.shippingAddress.flatHouse},{' '}
                  {order.shippingAddress.area}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    City:
                  </span>{' '}
                  {order.shippingAddress.city}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    State:
                  </span>{' '}
                  {order.shippingAddress.state}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    Postal Code:
                  </span>{' '}
                  {order.shippingAddress.pinCode}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-3'>Order Items</h3>
            <div className='space-y-4'>
              {order.items.map(item => (
                <div
                  key={item._id}
                  className='flex items-center gap-4 p-4 border rounded-lg bg-gray-50'
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className='w-20 h-20 object-cover rounded'
                    width={80}
                    height={80}
                  />
                  <div className='flex-1'>
                    <h4 className='font-medium'>{item.product.name}</h4>
                    <p className='text-xs text-muted-foreground'>
                      Size: {item.size.name} | Color: {item.color.name}
                    </p>
                    <p className='text-xs'>Quantity: {item.quantity}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-base'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='border-t pt-4 space-y-2'>
            <div className='flex justify-between items-center text-sm'>
              <span className='font-medium text-muted-foreground'>
                Subtotal:
              </span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='font-medium text-muted-foreground'>
                Shipping:
              </span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center font-bold text-lg mt-2'>
              <span>Total:</span>
              <span>
                ${(order.totalAmount + order.shippingCost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
