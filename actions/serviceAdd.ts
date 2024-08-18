"use server"

import * as z from "zod";
import {CustomerVehicleServiceAddFormSchema} from '@/schemas'

export const serviceAdd = async (values: z.infer<typeof CustomerVehicleServiceAddFormSchema>) => {
    const validatedFields = CustomerVehicleServiceAddFormSchema.safeParse(values);

    console.log(values);
    if(!validatedFields.success){
        return { error: "Tip Hatası." }
    }

    return { success: "Araç Dosyası oluşturuldu." }
}