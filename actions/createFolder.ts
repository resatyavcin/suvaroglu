"use server"

import {PutObjectCommand} from "@aws-sdk/client-s3";

//constants
import {folderName, type TCustomer} from "@/constants";
import {s3} from "@/constants/s3";
import {uuid} from "uuidv4";

export const createFolder = async (customer: TCustomer) => {

    const customerId = uuid()
    const createFolderCommand = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `${customerId}/${folderName(customer)}` + "contents/",
        Metadata: {
            'x-amz-meta-date': new Date().toISOString(),
        }
    });

    return {
        res: await s3().send(createFolderCommand),
        customerId,
        filePath: `${customerId}/${folderName(customer)}` + "contents/"
    }

}