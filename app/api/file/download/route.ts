"use server"

import {NextRequest, NextResponse} from "next/server";
import {uploadFile} from "@/actions/uploadFile";
import {downloadFiles} from "@/actions/downloaFiles";


export async function GET(req: NextRequest) {

    const data = await downloadFiles()

    try {

        return NextResponse.json({status: 200, message: "Dosya yada dosyalar başarıyla indirildi."});

    }catch (err){
        return NextResponse.json({error: err, message: "Dosya indirme başarısız oldu."}, {status:400});
    }
}