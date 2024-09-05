'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => signIn('google')}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AuthPage;
