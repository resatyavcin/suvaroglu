"use server"

import {NextRequest, NextResponse} from "next/server";
import {uploadFile} from "@/actions/uploadFile";


export async function POST(req: NextRequest) {
    const formData = await req.formData();


    const file = formData.get("file") as File;
    const filePath = formData.get("filePath") as string;

    try {
        if(!file){
            return NextResponse.json({error: "File is required"}, {status: 400});
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = await uploadFile(buffer, file.name, filePath);


        return NextResponse.json({status: 200, data: fileName});

    }catch (err){
        return NextResponse.json({error: err}, {status:400});
    }
}