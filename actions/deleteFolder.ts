'use server';

import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

//constants
import { type TCustomer } from '@/constants';
import { s3 } from '@/constants/s3';
import { deleteCustomer } from './deleteCustomer';

export const deleteFolder = async (
  customerIds: Pick<TCustomer, 'customerId'>[]
) => {
  try {
    for (let index = 0; index < customerIds.length; index++) {
      const element = customerIds[index] as unknown as string;

      await deleteCustomer({ customerId: element });

      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Prefix: element + '/', // Klasörün tüm içeriğini temsil eder
      });
      const listedObjects = await s3().send(listCommand);

      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        const deleteParams = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Delete: {
            Objects: listedObjects.Contents.map((item) => ({ Key: item.Key })),
          },
        };

        // Listedeki tüm nesneleri sil
        const deleteCommand = new DeleteObjectsCommand(deleteParams);

        await s3().send(deleteCommand);
      }
    }

    return {
      res: 'Kişi ve dosyası başarıyla silinmiştir.',
    };
  } catch (error) {
    console.error(error);
  }
};
