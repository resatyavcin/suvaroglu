'use server';

import { getFolder } from '@/actions/getFolder';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const urls = new URL(req.url);
    const fileId = req.url.split('/').pop()?.split('?')[0] || '';

    // Query parametrelerini al
    const otp = urls.searchParams.get('otp');
    const status = urls.searchParams.get('status');

    let data;

    if (status === 'authenticated') {
      data = await getFolder(fileId);
      return NextResponse.json({ status: 200, data: data });
    }

    data = await getFolder(fileId, otp || '');

    return NextResponse.json({ status: 200, data: data });
  } catch (err) {
    return NextResponse.json('Error occurred', { status: 500 });
  }
}
