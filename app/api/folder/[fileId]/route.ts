"use server"


import {getFolder} from "@/actions/getFolder";
import * as z from "zod";
import {CustomerVehicleServiceAddFormSchema} from "@/schemas";
import {NextRequest} from "next/server";


export async function GET(req: NextRequest) {
    try {
        const url = req.url;
        const fileId = url.split("/").pop() || "";
        const data = await getFolder(fileId)
        return Response.json({status: 200, data: data});

    }catch (err){
        Response.json({error: err});
    }
}
