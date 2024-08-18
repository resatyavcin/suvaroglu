import * as z from 'zod'

export const CustomerVehicleServiceAddFormSchema = z.object({
    customerName: z.string().min(1,{
        message: "Müşteri ismini girmek zorunludur.",
    }),
    customerSurname: z.string().min(1,{
        message: "Müşteri soyismini girmek zorunludur.",
    }),
    customerVehicleKM: z.string().min(1,{
        message: "Aracın kilometresini girmek zorunludur.",
    }),
    customerVehicle: z.string().min(1,{
        message: "Aracın markasını girmek zorunludur.",
    })
})