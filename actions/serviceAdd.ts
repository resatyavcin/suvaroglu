"use server"

import * as z from "zod";
import {google} from 'googleapis'

import {CustomerVehicleServiceAddFormSchema} from '@/schemas'

export const serviceAdd = async (values: z.infer<typeof CustomerVehicleServiceAddFormSchema>) => {
    const validatedFields = CustomerVehicleServiceAddFormSchema.safeParse(values);

    if(!validatedFields.success){
        return { error: "Tip Hatası." }
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )
    oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

    try {

        const fileMetadata = {
            name: values.customerName + "/"
                +values.customerSurname + "/"
                +values.customerVehicle + "/"
                +values.customerVehicleKM,
            mimeType: 'application/vnd.google-apps.folder',
        };

        const driveService = google.drive({
            version: 'v3',
            auth: oauth2Client
        })

        await driveService.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        })

        return { success: "Araç Dosyası oluşturuldu." }
    } catch (err) {
            // TODO(developer) - Handle error
        throw err;
    }

}