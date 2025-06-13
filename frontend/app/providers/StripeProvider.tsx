'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  if (!publishableKey) {
    console.error('Stripe publishable key is not defined');
    return null;
  }
  return loadStripe(publishableKey);
})();

interface StripeProviderProps {
  children: React.ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  if (!stripePromise) {
    return <>{children}</>;
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
}
