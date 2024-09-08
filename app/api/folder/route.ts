'use server';

import { NextRequest, NextResponse } from 'next/server';

import { createFolder } from '@/actions/createFolder';
import { listFolders } from '@/actions/listFolders';
import * as z from 'zod';
import { CustomerVehicleServiceAddFormSchema } from '@/schemas';
import { createCustomer } from '@/actions/createCustomer';

function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const data = await listFolders({
      customerName: searchParams.get('customerName') || '',
      customerVehicleNumber: searchParams.get('customerVehicleNumber') || '',
    });
    return Response.json({ status: 200, data: data });
  } catch (err) {
    return Response.json({ error: err });
  }
}

export async function POST(req: NextRequest) {
  const body: z.infer<typeof CustomerVehicleServiceAddFormSchema> =
    await req.json();
  const validatedFields = CustomerVehicleServiceAddFormSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ error: 'Tip Hatası.' });
  }

  const verifyCode = generateRandomCode();

  try {
    const {
      customerName,
      customerSurname,
      customerPhone,
      customerVehicle,
      customerVehicleKM,
      customerVehicleNumber,
    } = body;

    const data: any = await createFolder({
      customerName,
      customerSurname,
      customerPhone,
      customerVehicle,
      customerVehicleKM,
      customerVehicleNumber,
    } as any);

    await createCustomer({
      customerId: data.customerId,
      customerName,
      customerSurname,
      customerPhone,
      customerVehicle,
      customerVehicleKM,
      customerVehicleNumber,
      code: verifyCode,
      customerFilePath: data.filePath,
    } as any);

    return NextResponse.json({
      status: 200,
      data: {
        customerId: data.customerId,
        customerPhone,
        customerVerify: verifyCode,
      },
      message: 'Araç servise başarı ile kaydedilmiştir.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: JSON.stringify(err.message),
        message: 'Araç kaydetme başarısız. Lütfen tekrar deneyiniz.',
      },
      { status: 500 }
    );
  }
}
