"use server"

import { ScanCommand } from "@aws-sdk/client-dynamodb";
import {docClient} from "@/constants/dynamo";

interface ExpressionAttributeValues {
    [key: string]: { S: string }; // Adjust the type if needed
}

export const listFolders = async ({customerName, customerSurname}: {customerName: string, customerSurname: string}) => {

    try{
        const paramsWithExclusiveStartKey: {
            TableName: string;
            Limit: number;
            FilterExpression?: string;
            ExpressionAttributeValues?: ExpressionAttributeValues;
            ScanIndexForward?: boolean,
            IndexName?: string
        } = {
            TableName: "customer",
            Limit: 30
        };


        // Initialize values
        let filterExpression = '';
        const expressionAttributeValues: ExpressionAttributeValues = {};

        // Add FilterExpression and ExpressionAttributeValues based on customerName and customerSurname
        if (customerName) {
            filterExpression += 'contains(customerNameFilter, :statusValue)';
            expressionAttributeValues[':statusValue'] = { S: customerName.toLowerCase() };
        }

        if (customerSurname) {
            if (filterExpression) {
                filterExpression += ' AND ';
            }
            filterExpression += 'contains(customerSurnameFilter, :statusValue2)';
            expressionAttributeValues[':statusValue2'] = { S: customerSurname.toLowerCase() };
        }

        if (filterExpression) {
            paramsWithExclusiveStartKey.FilterExpression = filterExpression;
        }
        if (Object.keys(expressionAttributeValues).length > 0) {
            paramsWithExclusiveStartKey.ExpressionAttributeValues = expressionAttributeValues;
        }

        const dynamoReturnData = await docClient.send(new ScanCommand(paramsWithExclusiveStartKey));

        const processedData:any = (dynamoReturnData.Items ||[]).map(item => ({
            customerName: item.customerName.S,
            customerVehicle: item.customerVehicle.S,
            customerSurname: item.customerSurname.S,
            customerVehicleKM: item.customerVehicleKM.S,
            customerFilePath: item.customerFilePath.S,
            customerId: item.customerId.S,
            customerDate: item.customerDate.S as string,
        }))

        processedData.sort((a:any, b:any) => {
            const dateA = new Date(a.customerDate).getTime();
            const dateB = new Date(b.customerDate).getTime();
            return dateB - dateA;
        });


        return (processedData || []).map((content: any) => {
            return {
                nextMarker: (dynamoReturnData?.LastEvaluatedKey as any)?.customerId?.S,
                id: content.customerId,
                header: content.customerName + " " + content.customerSurname,
                description:  content.customerVehicle + " • " + content.customerVehicleKM,
            }
        });
    }catch (err){
        return err
    }



}