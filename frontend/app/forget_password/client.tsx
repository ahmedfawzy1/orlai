'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { LoaderCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { InputOTPSlot } from '../components/ui/input-otp';
import { InputOTP } from '../components/ui/input-otp';
import { InputOTPGroup } from '../components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

export default function ForgotPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password, 4: success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const {
    isRequestingOtp,
    isVerifyingOtp,
    isResettingPassword,
    requestOtp,
    verifyOtp,
    resetPassword,
  } = useAuthStore();

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await requestOtp(email);
    if (success) setStep(2);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOtp(email, otp);
    if (success) setStep(3);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await resetPassword(email, otp, newPassword);
    if (success) setStep(4);
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='relative hidden bg-muted lg:block'>
        <Image
          src='/images/registration/forget_password.avif'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
          width={845}
          height={1024}
          priority
        />
      </div>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-start'>
          <div className='w-full max-w-xs'>
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className='flex flex-col gap-6'>
                <div className='flex flex-col items-start gap-2 text-center'>
                  <button
                    type='button'
                    className='flex items-center gap-2 mb-2 text-sm font-medium text-black w-fit cursor-pointer'
                    onClick={handleBack}
                    aria-label='Back'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    Back
                  </button>
                  <h1 className='text-3xl font-bold'>Forgot Password</h1>
                  <p className='text-balance text-left text-sm text-muted-foreground'>
                    Enter your registered email address. We'll send you a code
                    to reset your password.
                  </p>
                </div>
                <div className='grid gap-6'>
                  <div className='grid gap-2'>
                    <Label className='text-sm' htmlFor='email'>
                      Email Address
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      required
                      className='border-black focus-visible:!ring-0'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full py-5 font-normal transition-all duration-300 cursor-pointer'
                    disabled={isRequestingOtp}
                  >
                    {isRequestingOtp ? (
                      <LoaderCircle className='animate-spin' />
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className='flex flex-col gap-6'>
                <div className='flex flex-col items-start gap-2 text-center'>
                  <button
                    type='button'
                    className='flex items-center gap-2 mb-2 text-sm font-medium text-black w-fit cursor-pointer'
                    onClick={handleBack}
                    aria-label='Back'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    Back
                  </button>
                  <h1 className='text-3xl font-bold'>Enter OTP</h1>
                  <p className='text-balance text-left text-sm text-muted-foreground'>
                    We have sent a code to your registered email address.
                  </p>
                </div>
                <div className='grid gap-6'>
                  <div className='grid gap-2'>
                    <Label className='text-sm' htmlFor='otp'>
                      OTP
                    </Label>
                    {/* <Input
                      id='otp'
                      type='text'
                      placeholder='Enter OTP'
                      required
                      className='border-black focus-visible:!ring-0 tracking-widest text-center text-lg'
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      maxLength={6}
                    /> */}
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    type='submit'
                    className='w-full py-5 font-normal transition-all duration-300 cursor-pointer'
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? (
                      <LoaderCircle className='animate-spin' />
                    ) : (
                      'Verify'
                    )}
                  </Button>
                </div>
              </form>
            )}
            {step === 3 && (
              <form
                onSubmit={handleResetPassword}
                className='flex flex-col gap-6'
              >
                <div className='flex flex-col items-start gap-2 text-center'>
                  <button
                    type='button'
                    className='flex items-center gap-2 mb-2 text-sm font-medium text-black w-fit cursor-pointer'
                    onClick={handleBack}
                    aria-label='Back'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    Back
                  </button>
                  <h1 className='text-3xl font-bold'>Reset Password</h1>
                  <p className='text-balance text-left text-sm text-muted-foreground'>
                    Enter your new password below.
                  </p>
                </div>
                <div className='grid gap-6'>
                  <div className='grid gap-2'>
                    <Label className='text-sm' htmlFor='newPassword'>
                      New Password
                    </Label>
                    <Input
                      id='newPassword'
                      type='password'
                      placeholder='New Password'
                      required
                      className='border-black focus-visible:!ring-0'
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full py-5 font-normal transition-all duration-300 cursor-pointer'
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? (
                      <LoaderCircle className='animate-spin' />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </form>
            )}
            {step === 4 && (
              <div className='flex flex-col items-center justify-center gap-6 min-h-[300px]'>
                <CheckCircle2 className='w-16 h-16 text-green-500' />
                <h2 className='text-2xl font-bold text-center'>
                  Password Changed Successfully
                </h2>
                <p className='text-center text-muted-foreground'>
                  Your password has been updated successfully.
                </p>
                <Button
                  className='w-full'
                  onClick={() => router.push('/login')}
                >
                  Back to Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
