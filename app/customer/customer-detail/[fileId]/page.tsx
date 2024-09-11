'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useCustomerStore } from '@/store';
import { BsSpeedometer } from 'react-icons/bs';
import CustomerFolders from '@/components/customer/customer-folders';
import { MdDelete } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const CustomerFile = () => {
  const params = useParams();
  const { setFilePath, setFileName } = useCustomerStore();
  const [verifyContentMedia, setVerifyContentMedia] = useState<any>(undefined);
  const [otp, setOtp] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    data: customerInfoData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['customerInfo', params?.fileId],
    queryFn: async () => {
      const localOTP = localStorage.getItem('otp');
      const a = localOTP === null || localOTP === 'undefined';
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/${params?.fileId}?otp=${otp}&status=${status}`
      );

      if (!data.ok) {
        throw new Error('Error');
      }

      return data.json();
    },
    enabled:
      (!!params?.fileId && status === 'unauthenticated') ||
      (!!params?.fileId && status === 'authenticated'),
    retry: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated' && otp.length === 6) {
      refetch();
    }
  }, [otp]);

  const mediaMutation = useMutation({
    mutationFn: async (values: any) => {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      return data.json();
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (values: any) => {
      const form_data = new FormData();

      for (let key in values) {
        if (key !== 'file') {
          form_data.append(key, values[key]);
        }
      }

      for (var x = 0; x < values.file.length; x++) {
        form_data.append('file[]', values.file[x]);
      }

      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file`, {
        method: 'DELETE',
        body: form_data,
      });

      return data.json();
    },
    onSuccess: () => {
      setVerifyContentMedia(undefined);
    },
  });

  useEffect(() => {
    if (customerInfoData) {
      mediaMutation.mutate({ filePath: customerInfoData.data.filePath });
      setFilePath(customerInfoData.data.filePath);
      localStorage.setItem('defaultpath', customerInfoData.data.filePath);
      setFileName('');
    }
  }, [customerInfoData]);

  useEffect(() => {
    if (mediaMutation.isSuccess) {
      const verifyContents: any[] = mediaMutation.data.data.filter(
        (item: any, index: number) => (item.name as string).includes('verifyKM')
      )[0];
      if (verifyContents) {
        setVerifyContentMedia(verifyContents as any);
      }
    }
  }, [mediaMutation.isSuccess]);

  useEffect(() => {
    if (
      status === 'unauthenticated' &&
      params?.folderId === 'closing-documents'
    ) {
      router.push('/');
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  if (status === 'unauthenticated' && !customerInfoData && !isLoading) {
    return (
      <div className="w-full flex items-center mt-12">
        <div className="space-y-2 mx-auto">
          <InputOTP
            className="mx-auto"
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value as any)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
    );
  }

  if (status === 'authenticated' || customerInfoData) {
    return (
      <div className="mt-5">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <h4 className="text-sm font-medium leading-none">
              {customerInfoData?.data?.customer?.customerName +
                ' ' +
                customerInfoData?.data?.customer?.customerSurname}
            </h4>
            <p className="text-sm text-muted-foreground">
              {customerInfoData?.data?.customer?.customerVehicle +
                ' • ' +
                Intl.NumberFormat('tr-TR', {
                  maximumSignificantDigits: 3,
                }).format(
                  customerInfoData?.data?.customer?.customerVehicleKM || 0
                ) +
                ' KM'}
            </p>
          </div>

          {verifyContentMedia &&
            session &&
            session.user &&
            session?.user.email === process.env.NEXT_PUBLIC_SUVAROGLU_EMAIL && (
              <Button
                variant="destructive"
                className="mr-4"
                onClick={async () => {
                  mutationDelete.mutate({
                    filePath: customerInfoData.data.filePath,
                    file: ['verifyKM.jpeg'],
                  });
                }}
              >
                <MdDelete />
              </Button>
            )}

          <div>
            {verifyContentMedia ? (
              <PhotoProvider>
                <PhotoView src={verifyContentMedia?.url || ''}>
                  <Button className="mr-4 bg-green-600">
                    <BsSpeedometer />
                  </Button>
                </PhotoView>
              </PhotoProvider>
            ) : session &&
              session.user &&
              session?.user.email ===
                process.env.NEXT_PUBLIC_SUVAROGLU_EMAIL ? (
              <Link
                href={{
                  pathname: '/camera-mode',
                  query: { fileId: params?.fileId },
                }}
              >
                <Button
                  className="mr-4 bg-red-800"
                  onClick={() => setFileName('verifyKM.jpeg')}
                >
                  <BsSpeedometer />
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
        <Separator className="my-4" />
        {customerInfoData &&
          session &&
          session.user &&
          session?.user.email === process.env.NEXT_PUBLIC_SUVAROGLU_EMAIL && (
            <div className="flex flex-col mb-3 items-center justify-between">
              {(customerInfoData &&
                customerInfoData?.data?.customer?.experName) ||
              customerInfoData?.data?.customer?.experMail ||
              customerInfoData?.data?.customer?.experPhone ? (
                <>
                  <h2>Expertiz Bilgileri</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {customerInfoData?.data?.customer?.experName +
                      ' • ' +
                      customerInfoData?.data?.customer?.experMail +
                      ' • ' +
                      customerInfoData?.data?.customer?.experPhone}
                  </p>
                </>
              ) : (
                <>
                  {' '}
                  <div
                    className="bg-yellow-200 p-3 rounded-md
                          flex items-center gap-x-2 text-sm text-yellow-700 w-full"
                  >
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <p>{'Expertiz Bilgisi Bulunmamaktadır.'}</p>
                  </div>
                </>
              )}
            </div>
          )}
        <CustomerFolders />
      </div>
    );
  }
};

export default CustomerFile;
