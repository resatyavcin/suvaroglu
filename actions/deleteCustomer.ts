'use server';

//constants

import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/constants/dynamo';
import { TCustomer } from '@/constants';

export const deleteCustomer = async ({
  customerId,
}: Pick<TCustomer, 'customerId'>) => {
  try {
    const command = new DeleteCommand({
      TableName: process.env.NEXT_PUBLIC_AWS_TABLE,
      Key: {
        customerId,
      },
    });

    const response = await docClient.send(command);
    return {
      response,
    };
  } catch (error: any) {
    throw new Error('DeleteCustomer başarısız: ' + error.message);
  }
};
