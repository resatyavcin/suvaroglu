import * as z from 'zod';

export const CustomerVehicleServiceAddFormSchema = z.object({
  customerName: z.string().min(1, {
    message: 'Müşteri ismini girmek zorunludur.',
  }),
  customerSurname: z.string().min(1, {
    message: 'Müşteri soyismini girmek zorunludur.',
  }),
  customerPhone: z
    .string()
    .min(1, {
      message: 'Müşteri telefonunu girmek zorunludur.',
    })
    .regex(/^(05)[0-9]{9}$/, {
      message: 'Telefon numarası 05xxxxxxxxx formatında olmalıdır.',
    }),
  customerVehicleKM: z.string().min(1, {
    message: 'Aracın kilometresini girmek zorunludur.',
  }),
  customerVehicle: z.string().min(1, {
    message: 'Aracın markasını girmek zorunludur.',
  }),
  customerVehicleNumber: z.string().min(1, {
    message: 'Aracın plakasını girmek zorunludur.',
  }),
});
