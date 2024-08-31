"use server"

import {NextRequest, NextResponse} from "next/server";
import {uploadFile} from "@/actions/uploadFile";



export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const fileList = formData.getAll("file[]") as unknown as FileList;
    const file = formData.get("file") as File;
    const filePath = formData.get("filePath") as string;
    const fileNameSave = formData.get("fileName") as string;

    console.log("file",file);
    console.log("fileList",fileList);

    try {
        if(!fileList){
            return NextResponse.json({error: "File is required"}, {status: 400});
        }

        if(file){
            const buffer = Buffer.from(await file.arrayBuffer());
            await uploadFile(buffer, fileNameSave ? fileNameSave : file.name , filePath);

            return NextResponse.json({status: 200, message: "Dosya başarıyla yüklendi."});
        }

        for(let i = 0; i < fileList.length; i++){
            const buffer = Buffer.from(await fileList[i].arrayBuffer());
            await uploadFile(buffer, fileNameSave ? fileNameSave : fileList[i].name , filePath);
        }

        return NextResponse.json({status: 200, message: "Dosya başarıyla yüklendi."});

    }catch (err){
        return NextResponse.json({error: err, message: "Dosya yükleme başarısız oldu."}, {status:400});
    }
}