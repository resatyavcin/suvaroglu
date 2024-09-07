'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';

const AuthPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-y-3 -my-7">
      <h1 className="font-semibold text-2xl text-center">
        Suvaroglu Uygulamasına Google İle Giriş Yap
      </h1>
      <Button
        size="lg"
        className="w-full h-14 gap-x-4"
        variant="outline"
        onClick={() => signIn('google')}
      >
        <FcGoogle className="h-7 w-7" />
      </Button>
    </div>
  );
};

export default AuthPage;
