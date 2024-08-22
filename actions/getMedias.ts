"use server"

import {GetObjectCommand, ListObjectsCommand} from "@aws-sdk/client-s3";
import {s3} from "@/constants/s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
export const getMedias = async (filePath: string) => {

    const urls = []
    const getAllObjects = new ListObjectsCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Prefix: filePath
    });

    const allObjects = await s3().send(getAllObjects)

    const medias =  (allObjects.Contents || []).map((content: any) => {
        return  content.Key.split("/").at(-1)
    }).filter((content: any) => content !== "")

    for (const mediaString of medias) {
        const object = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: filePath + mediaString
        });
        urls.push(await getSignedUrl(s3(), object));
    }

    return urls

}