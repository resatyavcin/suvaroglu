'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import { Suspense, useEffect, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useCustomerStore } from '@/store';
import { useSession } from 'next-auth/react';

import 'react-html5-camera-photo/build/css/index.css';

function UploadButton({ file }: any) {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const { filePath, fileName, setFilePath } = useCustomerStore();

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const form_data = new FormData();

      for (let key in values) {
        form_data.append(key, values[key]);
      }
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file`, {
        method: 'POST',
        body: form_data,
      });

      return data.json();
    },
  });

  const handleUploadPhoto = () => {
    mutation.mutate({
      file,
      filePath,
      fileName: fileName ? fileName : file.name,
    });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      if (searchParams.get('folderId')) {
        push(`/folders/${searchParams.get('folderId')}`);
        return;
      }

      push(`/customer/customer-detail/${searchParams.get('fileId')}`);
    }
  }, [mutation.isSuccess]);

  return (
    <div className="w-full">
      {mutation.isPending && (
        <div>
          <p> Yükleniyor.. </p>
        </div>
      )}
      <Button className="w-full mt-3" onClick={handleUploadPhoto}>
        Fotoğrafı yükle
      </Button>
    </div>
  );
}

const CameraMode = () => {
  const [dataUri, setDataUri] = useState<any>();
  const [file, setFile] = useState<File | undefined>(undefined);
  const router = useRouter();

  const handleTakePhoto = (data: any) => {
    setDataUri(data);

    fetch(data)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `name-${Date.now()}.jpeg`, {
          type: 'image/jpeg',
        });
        setFile(file);
      });
  };

  const { data: session, status } = useSession();
  const { filePath } = useCustomerStore();

  useEffect(() => {
    if (status === 'unauthenticated' || !filePath) {
      router.push('/');
    }
  }, [status]);

  if (session) {
    return (
      <Suspense fallback={null}>
        <Card className="m-7">
          <CardHeader className="py-0">
            {dataUri && (
              <IoCloseSharp
                className="w-5 h-5 my-3"
                onClick={() => setDataUri(undefined)}
              />
            )}
          </CardHeader>
          <CardContent className="h-full w-full">
            {dataUri ? (
              <div className="flex flex-col justify-between items-center w-full">
                <img src={dataUri} alt={'screenshot'} />
                <UploadButton file={file} />
              </div>
            ) : (
              <div className="mt-5">
                <Camera
                  idealFacingMode={'environment'}
                  imageType={IMAGE_TYPES.JPG}
                  imageCompression={0.25}
                  isMaxResolution={true}
                  onTakePhotoAnimationDone={(dataUri) => {
                    handleTakePhoto(dataUri);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </Suspense>
    );
  }
};

export default CameraMode;
