'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useCheckoutStore } from '@/app/store/useCheckoutStore';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CardPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { setPaymentDetails } = useCheckoutStore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement)!,
        });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message || 'An error occurred');
        return;
      }

      if (paymentMethod) {
        setPaymentDetails({
          method: 'card',
          paymentMethodId: paymentMethod.id,
          cardType: paymentMethod.card?.brand || '',
          last4: paymentMethod.card?.last4 || '',
        });
        router.push('/checkout/review');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label>Card Details</Label>
        <div className='p-3 border rounded-md'>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
      <Button type='submit' disabled={!stripe || processing} className='w-full'>
        {processing ? 'Processing...' : 'Continue'}
      </Button>
    </form>
  );
};

export default function PaymentForm() {
  const [method, setMethod] = useState('card');
  const { setPaymentDetails } = useCheckoutStore();
  const router = useRouter();

  const handleMethodChange = (newMethod: 'card' | 'cod') => {
    setMethod(newMethod);
    if (newMethod === 'cod') {
      setPaymentDetails({
        method: 'cod',
      });
      router.push('/checkout/review');
    }
  };

  return (
    <div>
      <h3 className='text-xl font-bold'>Select a payment method</h3>
      <Card className='mt-4'>
        <CardContent className='py-6 flex flex-col gap-4'>
          <div className='flex items-center gap-2 mb-2'>
            <input
              type='radio'
              id='card'
              checked={method === 'card'}
              onChange={() => handleMethodChange('card')}
            />
            <label htmlFor='card'>Debit/Credit Card</label>
          </div>
          {method === 'card' && (
            <Elements stripe={stripePromise}>
              <CardPaymentForm />
            </Elements>
          )}
          <div className='flex items-center gap-2'>
            <input
              type='radio'
              id='gpay'
              checked={method === 'gpay'}
              onChange={() => setMethod('gpay')}
              disabled
            />
            <label htmlFor='gpay'>Google Pay</label>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='radio'
              id='paypal'
              checked={method === 'paypal'}
              onChange={() => setMethod('paypal')}
              disabled
            />
            <label htmlFor='paypal'>Paypal</label>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='radio'
              id='cod'
              checked={method === 'cod'}
              onChange={() => handleMethodChange('cod')}
            />
            <label htmlFor='cod'>Cash on Delivery</label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
