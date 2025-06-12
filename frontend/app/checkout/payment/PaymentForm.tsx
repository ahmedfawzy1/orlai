'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'react-hot-toast';
import { useCheckoutStore } from '@/app/store/useCheckoutStore';

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export default function PaymentForm() {
  const [method, setMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Partial<CardDetails>>({});
  const [cardType, setCardType] = useState<string>('');
  const { setPaymentDetails } = useCheckoutStore();
  const router = useRouter();

  const validateCardNumber = (number: string) => {
    // Remove spaces and non-digits
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return 'Card number must be between 13 and 19 digits';
    }
    return '';
  };

  const validateExpiry = (expiry: string) => {
    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!month || !year) return 'Invalid expiry date';
    if (parseInt(month) < 1 || parseInt(month) > 12) return 'Invalid month';
    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      return 'Card has expired';
    }
    return '';
  };

  const validateCVV = (cvv: string) => {
    if (cvv.length < 3 || cvv.length > 4) return 'CVV must be 3 or 4 digits';
    return '';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    return '';
  };

  const handleInputChange = (field: keyof CardDetails, value: string) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(value));
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof CardDetails) => {
    let error = '';
    switch (field) {
      case 'number':
        error = validateCardNumber(cardDetails.number);
        break;
      case 'expiry':
        error = validateExpiry(cardDetails.expiry);
        break;
      case 'cvv':
        error = validateCVV(cardDetails.cvv);
        break;
      case 'name':
        if (!cardDetails.name.trim()) error = 'Name is required';
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = () => {
    return (
      !Object.values(errors).some(error => error) &&
      Object.values(cardDetails).every(value => value.trim() !== '')
    );
  };

  const handleProceedToReview = () => {
    if (method === 'card' && !isFormValid()) {
      toast.error('Please fill in all card details correctly');
      return;
    }

    const paymentDetails = {
      method: method as 'card' | 'cod',
      ...(method === 'card' && {
        cardDetails: {
          number: cardDetails.number,
          name: cardDetails.name,
          expiry: cardDetails.expiry,
          cardType,
        },
      }),
    };

    setPaymentDetails(paymentDetails);
    router.push('/checkout/review');
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
              onChange={() => setMethod('card')}
            />
            <label htmlFor='card'>Debit/Credit Card</label>
          </div>
          {method === 'card' && (
            <div className='flex flex-col gap-3 mb-2'>
              <div className='flex flex-col gap-1'>
                <Label htmlFor='cardNumber'>Card Number</Label>
                <Input
                  id='cardNumber'
                  type='text'
                  className={`!ring-0 ${errors.number && 'border-red-500'}`}
                  placeholder='1234 5678 9012 3456'
                  value={cardDetails.number}
                  onChange={e => handleInputChange('number', e.target.value)}
                  onBlur={() => handleBlur('number')}
                  maxLength={19}
                />
                {errors.number && (
                  <span className='text-sm text-red-500'>{errors.number}</span>
                )}
                {cardType && (
                  <span className='text-sm text-gray-500 capitalize'>
                    {cardType}
                  </span>
                )}
              </div>

              <div className='flex flex-col gap-1'>
                <Label htmlFor='cardName'>Cardholder Name</Label>
                <Input
                  id='cardName'
                  className={`!ring-0 ${errors.name && 'border-red-500'}`}
                  placeholder='John Doe'
                  value={cardDetails.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                />
                {errors.name && (
                  <span className='text-sm text-red-500'>{errors.name}</span>
                )}
              </div>

              <div className='flex gap-4'>
                <div className='flex flex-col gap-1 w-1/2'>
                  <Label htmlFor='expiry'>Expiry Date</Label>
                  <Input
                    id='expiry'
                    className={`!ring-0 ${errors.expiry && 'border-red-500'}`}
                    placeholder='MM/YY'
                    value={cardDetails.expiry}
                    onChange={e => handleInputChange('expiry', e.target.value)}
                    onBlur={() => handleBlur('expiry')}
                    maxLength={5}
                  />
                  {errors.expiry && (
                    <span className='text-sm text-red-500'>
                      {errors.expiry}
                    </span>
                  )}
                </div>

                <div className='flex flex-col gap-1 w-1/2'>
                  <Label htmlFor='cvv'>CVV</Label>
                  <Input
                    id='cvv'
                    type='password'
                    className={`!ring-0 ${errors.cvv && 'border-red-500'}`}
                    placeholder='123'
                    value={cardDetails.cvv}
                    onChange={e => handleInputChange('cvv', e.target.value)}
                    onBlur={() => handleBlur('cvv')}
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <span className='text-sm text-red-500'>{errors.cvv}</span>
                  )}
                </div>
              </div>
            </div>
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
              onChange={() => setMethod('cod')}
            />
            <label htmlFor='cod'>Cash on Delivery</label>
          </div>
        </CardContent>
      </Card>
      <Button
        className='w-full mt-6'
        onClick={handleProceedToReview}
        disabled={method === 'card' && !isFormValid()}
      >
        Continue
      </Button>
    </div>
  );
}
