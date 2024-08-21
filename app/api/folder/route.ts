"use server"

import {NextRequest, NextResponse} from "next/server";

import {createFolder} from "@/actions/createFolder";
import {listFolders} from "@/actions/listFolders";
import * as z from "zod";
import {CustomerVehicleServiceAddFormSchema} from "@/schemas";


export async function GET(req: NextRequest) {
    try {

        const data = await listFolders()
        return Response.json({status: 200, data: data});

    }catch (err){
        Response.json({error: err});
    }
}


export async function POST(req: NextRequest) {
    const body : z.infer<typeof CustomerVehicleServiceAddFormSchema> = await req.json();
    const validatedFields = CustomerVehicleServiceAddFormSchema.safeParse(body);

    if(!validatedFields.success){
        return Response.json({ error: "Tip Hatası." })
    }

    try {
        const { customerName,
            customerSurname,
            customerVehicle,
            customerVehicleKM
        } = body

        const data = await createFolder({
            customerName,
            customerSurname,
            customerVehicle,
            customerVehicleKM,
        } as any)

        return Response.json({status: 200, data: data.customerId, message: "Araç servise başarı ile kaydedilmiştir."})

    }catch (err){
        return Response.json({error: err, message: "Araç kaydetme başarısızç Lütfen tekrar deneyiniz."});
    }
}
