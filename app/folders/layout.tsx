'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoArrowBackCircle } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface LayoutProps {
  children: React.ReactNode;
}

const FolderLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const handlePreviousPage = () => {
    const defaultPath = localStorage.getItem('defaultpath');
    router.push(
      `/customer/customer-detail/${(defaultPath || '').split('/')[0]}`
    );
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

export default FolderLayout;
