"use server"

//constants

import { PutCommand } from "@aws-sdk/lib-dynamodb"
import {docClient} from '@/constants/dynamo'
import {TCustomer} from "@/constants";

export const createCustomer = async ({
                                         customerId,
                                         customerName,
                                         customerSurname,
                                         customerVehicle,
                                         customerVehicleKM,
                                         customerFilePath
                                     }: TCustomer & { customerFilePath: string }) => {


    try{
        const command = new PutCommand({
            TableName: process.env.NEXT_PUBLIC_AWS_TABLE,
            Item: {
                customerId,
                customerName,
                customerSurname,
                customerNameFilter: customerName.toLowerCase(),
                customerSurnameFilter: customerSurname.toLowerCase(),
                customerVehicle,
                customerVehicleKM,
                customerFilePath,
                customerDate: new Date().toISOString(),
            }
        })

        const response = await docClient.send(command);

        return {
            response
        }
    }catch (error: any){
        throw new Error("CreateCustomer başarısız: " + JSON.stringify(error));
    }

}