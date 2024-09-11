'use server';

//constants

import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/constants/dynamo';

function removeSpaces(str: string) {
  return str.replace(/\s+/g, '');
}

export const updateCustomer = async ({
  customerId,
  customerName,
  customerSurname,
  customerPhone,
  customerVehicle,
  customerVehicleKM,
  customerVehicleNumber,
  experName,
  experPhone,
  experMail,
}: any) => {
  try {
    const command = new UpdateCommand({
      TableName: process.env.NEXT_PUBLIC_AWS_TABLE,
      Key: {
        customerId,
      },
      UpdateExpression:
        'SET customerName = :name, customerSurname = :surname, customerPhone = :phone, customerNameFilter = :nameFilter, customerSurnameFilter = :surnameFilter, customerVehicle = :vehicle, customerVehicleKM = :vehicleKM, customerVehicleNumber = :vehicleNumber, customerVehicleNumberFilter = :vehicleNumberFilter, experName = :experName, experPhone = :experPhone, experMail = :experMail',
      ExpressionAttributeValues: {
        ':name': customerName,
        ':surname': customerSurname,
        ':phone': customerPhone,
        ':nameFilter': customerName.toLowerCase(),
        ':surnameFilter': customerSurname.toLowerCase(),
        ':vehicle': customerVehicle,
        ':vehicleKM': customerVehicleKM,
        ':vehicleNumber': customerVehicleNumber,
        ':experName': experName,
        ':experPhone': experPhone,
        ':experMail': experMail,
        ':vehicleNumberFilter': removeSpaces(
          customerVehicleNumber.toLowerCase()
        ),
      },
      ReturnValues: 'UPDATED_NEW',
    });

    const response = await docClient.send(command);

    return {
      response,
    };
  } catch (error: any) {
    throw new Error('updateCustomer başarısız: ' + error);
  }
};
