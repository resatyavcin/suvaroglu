"use server"

import {ListObjectsCommand} from "@aws-sdk/client-s3";
import {s3} from "@/constants/s3";

export const listFolders = async () => {

    const listFolder = new ListObjectsCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Delimiter: "contents/",
    });

    const listFolderPromise = await s3().send(listFolder)

    return (listFolderPromise.CommonPrefixes || []).map((content: any) => {
        const id = content.Prefix.slice(0, -1).split('/')[0]
        const info = content.Prefix.slice(0, -1).split('/')[1].split("-")
        return {
            id,
            header: info[0] + " " + info[1],
            description: info[2] + " • " + new Intl.NumberFormat('tr-TR', { style: "decimal" }).format(info[3]),
        }
    });

}