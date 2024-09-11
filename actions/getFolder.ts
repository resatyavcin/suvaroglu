'use server';

import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { docClient } from '@/constants/dynamo';
import { TCustomer } from '@/constants';

export const getFolder = async (
  fileId: string,
  otp?: string,
  status?: string
) => {
  if ((!otp || otp === '') && (status === 'unauthenticated' || !status)) {
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
    keyof (TCustomer & {
      customerFilePath: string;
      experName: string;
      experPhone: string;
      experMail: string;
      code: number;
    }),
    { S: string }
  >;

  if (item.code.S !== otp && status === 'unauthenticated') {
    throw new Error('OTP Hatası');
  }

  return {
    id: item.customerId.S,
    filePath: item.customerFilePath.S,
    customer: {
      customerName: item.customerName.S,
      customerSurname: item.customerSurname.S,
      customerPhone: item.customerPhone.S,
      customerVehicle: item.customerVehicle.S,
      customerVehicleKM: item.customerVehicleKM.S,
      customerVehicleNumber: item.customerVehicleNumber.S,
      experName: item.experName && item.experName.S,
      experPhone: item.experPhone && item.experPhone.S,
      experMail: item.experMail && item.experMail.S,
    },
  };
};
