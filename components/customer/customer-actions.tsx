'use client';

import { Button } from '@/components/ui/button';
import { IoCloudDownload, IoShareSocial, IoTrash } from 'react-icons/io5';
import { useCustomerStore } from '@/store';
import { CustomerAlertDialog } from '@/components/customer/customer-alert';
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';

const CustomerActions = () => {
  const {
    isViewActionButtons,
    setIsOpenAlertDialogComponent,
    isOpenAlertDialogComponent,
    selectedCustomers,
  } = useCustomerStore();

  const mutationDelete = useMutation({
    mutationFn: async (values: any) => {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder`, {
        method: 'DELETE',
        body: JSON.stringify(values),
      });

      return data.json();
    },
  });

  return (
    <div className="mt-4">
      <CustomerAlertDialog
        title={'Emin misin?'}
        description={
          'Seçtiğiniz kayıtlar silinecektir. Geri alnımaz. Silmek istediğinizden emin misiniz?'
        }
        okText={'Kalıcı olarak sil'}
        cancelText={'Vazgeç'}
        onApprove={() => {
          mutationDelete.mutate({ customers: [...(selectedCustomers || [])] });
          setIsOpenAlertDialogComponent();
        }}
        onCancel={() => {
          setIsOpenAlertDialogComponent();
        }}
        isOpen={isOpenAlertDialogComponent}
      />

      {isViewActionButtons && (
        <div className={'flex gap-x-1.5'}>
          <Button
            variant={'destructive'}
            onClick={() => {
              setIsOpenAlertDialogComponent();
            }}
          >
            <IoTrash className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerActions;
