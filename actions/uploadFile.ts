"use server"

import {PutObjectCommand} from "@aws-sdk/client-s3";
import {s3} from "@/constants/s3";

export const uploadFile = async (file: any, fileName: any, filePath: any) => {

    try {
        const uploadToS3 = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: filePath + fileName,
            Body: file,
            ContentType: "image/png",
        })
        return await s3().send(uploadToS3);

    } catch (error) {
        console.error(error);
    }

}