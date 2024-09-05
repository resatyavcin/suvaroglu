'use server';

import { GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/constants/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const blobToBase64 = (blob: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // Base64 formatındaki veri URL olarak döner
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      console.error('Base64 dönüşüm hatası:', error);
      reject(error);
    };

    // Blob verisini base64 formatına dönüştür
    reader.readAsDataURL(blob);
  });

export const getMedias = async (filePath: string) => {
  try {
    const urls = [];
    const getAllObjects = new ListObjectsCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Prefix: filePath,
    });

    const allObjects = await s3().send(getAllObjects);

    const medias = (allObjects.Contents || [])
      .map((content: any) => {
        return content.Key.split('/').at(-1);
      })
      .filter((content: any) => content !== '');

    for (const mediaString of medias) {
      const object = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key:
          mediaString !== 'verifyKM.jpeg'
            ? filePath + '/' + mediaString
            : filePath + mediaString,
      });

      const url = await getSignedUrl(s3(), object, { expiresIn: 3600 });

      urls.push({
        url: `https://suvaroglu.s3.eu-north-1.amazonaws.com/${
          mediaString !== 'verifyKM.jpeg'
            ? filePath + '/' + mediaString
            : filePath + mediaString
        }`,
        name: mediaString,
      });
    }

    return urls;
  } catch (err) {
    console.log(err);
  }
};
