import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Address {
  _id: string;
  name: string;
  phone: string;
  flatHouse: string;
  area: string;
  city: string;
  pinCode: string;
  state: string;
}

interface PaymentDetails {
  method: 'card' | 'cod';
  paymentMethodId?: string;
  cardType?: string;
  last4?: string;
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cardType: string;
  };
}

interface CheckoutState {
  selectedAddress: Address | null;
  paymentDetails: PaymentDetails | null;
  setSelectedAddress: (address: Address) => void;
  setPaymentDetails: (details: PaymentDetails) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    set => ({
      selectedAddress: null,
      paymentDetails: null,
      setSelectedAddress: address => set({ selectedAddress: address }),
      setPaymentDetails: details => set({ paymentDetails: details }),
      clearCheckout: () => set({ selectedAddress: null, paymentDetails: null }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);
