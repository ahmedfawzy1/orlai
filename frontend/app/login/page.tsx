import Image from 'next/image';
import { Input } from '../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '../components/ui/button';
import Link from 'next/link';

export default function page() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='relative hidden bg-muted lg:block'>
        <Image
          src='/images/registration/login.avif'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
          width={845}
          height={1024}
        />
      </div>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <form className='flex flex-col gap-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Login to your account</h1>
                <p className='text-balance text-sm text-muted-foreground'>
                  Enter your email below to login to your account
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
                  />
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label className='text-sm' htmlFor='password'>
                      Password
                    </Label>
                  </div>
                  <Input
                    className='border-black focus-visible:!ring-0'
                    id='password'
                    type='password'
                    required
                  />
                  <Link href='/forgot-password' className='text-sm'>
                    Forgot your password?
                  </Link>
                </div>
                <Button
                  type='submit'
                  className='w-full py-5 font-normal transition-all duration-300 cursor-pointer'
                >
                  Login
                </Button>
                <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                  <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                    Or continue with
                  </span>
                </div>
                <Button
                  variant='outline'
                  className='py-[18px] w-full cursor-pointer'
                >
                  <Image
                    src='/images/icons/google.svg'
                    alt='google'
                    width={24}
                    height={24}
                  />
                  Login with Google
                </Button>
              </div>
              <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link className='hover:underline' href='/sign-up'>
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
