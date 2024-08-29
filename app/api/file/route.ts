"use server"

import {NextRequest, NextResponse} from "next/server";
import {uploadFile} from "@/actions/uploadFile";



export async function POST(req: NextRequest) {
    const formData = await req.formData();


    const file = formData.get("file") as File;
    const filePath = formData.get("filePath") as string;
    const fileNameSave = formData.get("fileName") as string;

    try {
        if(!file){
            return NextResponse.json({error: "File is required"}, {status: 400});
        }


        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = await uploadFile(buffer, fileNameSave ? fileNameSave : file.name , filePath);


        return NextResponse.json({status: 200, data: fileName, message: "Dosya başarıyla yüklendi."});

    }catch (err){
        return NextResponse.json({error: err, message: "Dosya yükleme başarısız oldu."}, {status:400});
    }
}