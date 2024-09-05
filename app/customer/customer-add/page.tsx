'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CustomerServiceAddForm from '@/components/customer/customer-service-add-form';
import { useEffect } from 'react';

export default function CustomerAdd() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  if (session) {
    return <CustomerServiceAddForm />;
  }

  return null;
}
