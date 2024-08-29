"use server"

import {NextRequest, NextResponse} from "next/server";

import {createFolder} from "@/actions/createFolder";
import {listFolders} from "@/actions/listFolders";
import * as z from "zod";
import {CustomerVehicleServiceAddFormSchema} from "@/schemas";
import {createCustomer} from "@/actions/createCustomer";


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const data = await listFolders(
            {
                customerName: (searchParams.get("customerName")) || "",
                customerSurname: (searchParams.get("customerSurname")) || ""
            }
        )
        return Response.json({status: 200, data: data});

    }catch (err){
        return Response.json({error: err});
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

        await createCustomer({
            customerId: data.customerId,
            customerName,
            customerSurname,
            customerVehicle,
            customerVehicleKM,
            customerFilePath: data.filePath
        } as any)


        return Response.json({status: 200, data: data.customerId, message: "Araç servise başarı ile kaydedilmiştir."})

    }catch (err){
        return Response.json({error: err, message: "Araç kaydetme başarısız. Lütfen tekrar deneyiniz."});
    }
}
