'use server';

import { NextRequest, NextResponse } from 'next/server';

import { createFolder } from '@/actions/createFolder';
import { listFolders } from '@/actions/listFolders';
import * as z from 'zod';
import {
  CustomerVehicleServiceUpdateFormSchema,
  CustomerVehicleServiceAddFormSchema,
} from '@/schemas';
import { createCustomer } from '@/actions/createCustomer';
import { deleteFolder } from '@/actions/deleteFolder';
import { updateCustomer } from '@/actions/updateCustomer';

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

  const verifyCode = generateRandomCode().toString();

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
      customerId: data.customerID,
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
        customerId: data.customerID,
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

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const validatedFields =
    CustomerVehicleServiceUpdateFormSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json({ error: 'Tip Hatası.' });
  }

  try {
    const {
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
    } = body;

    const result = await updateCustomer({
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
    } as any);

    return NextResponse.json({
      status: 200,
      result,
      message: 'Araç servise başarı ile güncellenmiştir.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: JSON.stringify(err.message),
        message: 'Araç güncelleme başarısız. Lütfen tekrar deneyiniz.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const formData = await req.json();

  try {
    await deleteFolder(formData.customers);

    return NextResponse.json({
      status: 200,
      message: 'Dosya Silme Başarıyla tamamalandı.',
    });
  } catch (err) {
    console.error('Error deleting files:', err);
    return NextResponse.json(
      { error: err, message: 'Dosya Silme Başarısız.' },
      { status: 400 }
    );
  }
}
