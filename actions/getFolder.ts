"use server"

import {ListObjectsCommand} from "@aws-sdk/client-s3";
import {s3} from "@/constants/s3";

export const getFolder = async (fileId: string) => {

    const listFolder = new ListObjectsCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
    });

    const listFolderPromise = await s3().send(listFolder)

    return (listFolderPromise.Contents || []).filter((content: any) =>
        content.Key?.slice(0, -1)?.split('/')[0] === fileId
    ).map((content: any) =>{
        const id = content.Key?.slice(0, -1)?.split('/')[0]
        const info = content.Key?.slice(0, -1)?.split('/')[1]?.split('-')

        return {
            id,
            filePath: content.Key?.split('/')[0] + "/" + content.Key?.split('/')[1] + "/" + content.Key?.split('/')[2] + "/",
            customer: {
                customerName: info[0],
                customerSurname: info[1],
                customerVehicle: info[2],
                customerVehicleKM: info[3]
            }
        }
    })[0];

}