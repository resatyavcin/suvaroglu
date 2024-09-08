'use server';

//constants

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/constants/dynamo';
import { TCustomer } from '@/constants';

function removeSpaces(str: string) {
  return str.replace(/\s+/g, '');
}

export const createCustomer = async ({
  customerId,
  customerName,
  customerSurname,
  customerPhone,
  customerVehicle,
  customerVehicleKM,
  customerVehicleNumber,
  customerFilePath,
}: TCustomer & { customerFilePath: string }) => {
  try {
    const command = new PutCommand({
      TableName: process.env.NEXT_PUBLIC_AWS_TABLE,
      Item: {
        customerId,
        customerName,
        customerSurname,
        customerPhone,
        customerNameFilter: customerName.toLowerCase(),
        customerSurnameFilter: customerSurname.toLowerCase(),
        customerVehicle,
        customerVehicleKM,
        customerVehicleNumber,
        customerVehicleNumberFilter: removeSpaces(
          customerVehicleNumber.toLowerCase()
        ),
        customerFilePath,
        customerDate: new Date().toISOString(),
      },
    });

    const response = await docClient.send(command);

    return {
      response,
    };
  } catch (error: any) {
    throw new Error('CreateCustomer başarısız: ' + error);
  }
};
