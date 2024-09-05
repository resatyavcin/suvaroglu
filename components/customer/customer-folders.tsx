'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaFolder } from 'react-icons/fa6';
import Link from 'next/link';
import { useCustomerStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CustomerFolders = () => {
  const { folders } = useCustomerStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-4">
      {folders.map((item: { folderName: string; folderPath: string }) => {
        if (
          (session &&
            session.user &&
            session?.user.email === process.env.NEXT_PUBLIC_SUVAROGLU_EMAIL) ||
          item.folderPath !== '/closing-documents'
        ) {
          return (
            <Link key={item.folderPath} href={`/folders/${item.folderPath}`}>
              <div className={'flex flex-col justify-center items-center'}>
                <Button className={'w-20 h-20'} variant={'secondary'}>
                  <FaFolder className={'w-10 h-10 text-blue-500'} />
                </Button>
                <p
                  className={
                    'font-semibold text-gray-600 text-sm text-center mt-2'
                  }
                >
                  {item.folderName}
                </p>
              </div>
            </Link>
          );
        } else {
          <Link key={item.folderPath} href={`/folders/${item.folderPath}`}>
            <div className={'flex flex-col justify-center items-center'}>
              <Button className={'w-20 h-20'} variant={'secondary'}>
                <FaFolder className={'w-10 h-10 text-blue-500'} />
              </Button>
              <p
                className={
                  'font-semibold text-gray-600 text-sm text-center mt-2'
                }
              >
                {item.folderName}
              </p>
            </div>
          </Link>;
        }
      })}
    </div>
  );
};

export default CustomerFolders;
