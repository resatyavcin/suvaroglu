'use server';

import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/actions/uploadFile';
import { deleteFile } from '@/actions/deleteFile';

function turkishToEnglish(str: string) {
  const charMap: Record<string, string> = {
    Ç: 'C',
    Ö: 'O',
    Ş: 'S',
    İ: 'I',
    Ğ: 'G',
    Ü: 'U',
    ç: 'c',
    ö: 'o',
    ş: 's',
    ı: 'i',
    ğ: 'g',
    ü: 'u',
  };

  return str
    .normalize('NFC')
    .split('')
    .map((char) => charMap[char] || char)
    .join('');
}

export async function DELETE(req: NextRequest) {
  const formData = await req.formData();
  const fileList = formData.getAll('file[]') as unknown as FileList;
  const filePath = formData.get('filePath') as string;

  if (!fileList || fileList.length === 0) {
    return NextResponse.json(
      { error: 'No files provided for deletion' },
      { status: 400 }
    );
  }

  try {
    for (let i = 0; i < fileList.length; i++) {
      const fileName = ((fileList[i] as any).split('/').pop() as string).split(
        '?'
      )[0];
      await deleteFile(filePath, fileName);
    }

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

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const fileList = formData.getAll('file[]') as unknown as FileList;
  const file = formData.get('file') as File;
  const filePath = formData.get('filePath') as string;
  const fileNameSave = formData.get('fileName') as string;

  try {
    if (!fileList) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      await uploadFile({
        file: buffer,
        fileName: fileNameSave
          ? fileNameSave
          : turkishToEnglish(file.name).toLowerCase().replace(/ /g, '-'),
        filePath,
        contentType: file.type,
      });

      return NextResponse.json({
        status: 200,
        message: 'Dosya başarıyla yüklendi.',
      });
    }

    for (let i = 0; i < fileList.length; i++) {
      const buffer = Buffer.from(await fileList[i].arrayBuffer());
      await uploadFile({
        file: buffer,
        fileName: fileNameSave
          ? fileNameSave
          : turkishToEnglish(fileList[i].name).toLowerCase().replace(/ /g, '-'),
        filePath,
        contentType: fileList[i].type,
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Dosya başarıyla yüklendi.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err, message: 'Dosya yükleme başarısız oldu.' },
      { status: 400 }
    );
  }
}
