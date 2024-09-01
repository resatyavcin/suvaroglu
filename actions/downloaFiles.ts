"use server"

import {GetObjectCommand, ListObjectsCommand} from "@aws-sdk/client-s3";
import {s3} from "@/constants/s3";

export const downloadFiles = async () => {

    const listFolder = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: "name-1725054643646.jpeg",
    });

    const listFolderPromise = await s3().send(listFolder)

}