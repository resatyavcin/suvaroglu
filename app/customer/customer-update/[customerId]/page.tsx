'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CustomerServiceAddForm from '@/components/customer/customer-service-add-form';
import { useEffect } from 'react';
import CustomerServiceUpdateForm from '@/components/customer/customer-service-update-form';

export default function CustomerUpdate() {
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
    return <CustomerServiceUpdateForm status={status} />;
  }

  return null;
}
