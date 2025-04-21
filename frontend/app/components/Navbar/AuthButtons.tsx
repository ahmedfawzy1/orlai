import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

interface AuthButtonsProps {
  login: { title: string; url: string };
}

const AuthButtons = ({ login }: AuthButtonsProps) => {
  return (
    <Button asChild variant='default' size='sm'>
      <Link href={login.url}>{login.title}</Link>
    </Button>
  );
};

export default AuthButtons;
