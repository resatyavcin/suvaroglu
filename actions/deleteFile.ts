'use server';

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/constants/s3';

export const deleteFile = async (filePath: string, fileName: string) => {
  try {
    const deleteFromS3 = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: filePath + fileName,
    });
    return await s3().send(deleteFromS3);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error; // Rethrow the error if needed for further handling
  }
};
