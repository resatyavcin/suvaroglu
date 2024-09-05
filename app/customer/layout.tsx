'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IoArrowBackCircle } from 'react-icons/io5';

interface LayoutProps {
  children: React.ReactNode;
}
const CustomerLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const handlePreviousPage = () => {
    router.push('/');
  };

  return (
    <div className="p-7">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="p-0" onClick={handlePreviousPage}>
          <IoArrowBackCircle className="h-7 w-7" />
        </Button>
        <h1 className="font-extrabold text-blue-500">Suvaroglu</h1>
      </div>
      {children}
    </div>
  );
};

export default CustomerLayout;
