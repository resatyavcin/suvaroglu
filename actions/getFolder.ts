'use server';

import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { docClient } from '@/constants/dynamo';
import { TCustomer } from '@/constants';

export const getFolder = async (fileId: string, otp?: string) => {
  if (!otp) {
    throw new Error('OTP Hatası');
  }

  const command = new GetItemCommand({
    TableName: process.env.NEXT_PUBLIC_AWS_TABLE,
    Key: {
      customerId: { S: fileId },
    },
  });

  const response = await docClient.send(command);

  const item = response.Item as unknown as Record<
    keyof (TCustomer & { customerFilePath: string; code: number }),
    { S: string; N: string }
  >;

  if (otp && item.code.N !== otp) {
    throw new Error('OTP Hatası');
  }
  return {
    id: item.customerId.S,
    filePath: item.customerFilePath.S,
    customer: {
      code: item.code.N,
      customerName: item.customerName.S,
      customerSurname: item.customerSurname.S,
      customerVehicle: item.customerVehicle.S,
      customerVehicleKM: item.customerVehicleKM.S,
    },
  };
};
