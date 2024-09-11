'use client';

import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';

import {
  CustomerVehicleServiceAddFormSchema,
  CustomerVehicleServiceUpdateFormSchema,
} from '@/schemas';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const CustomerServiceUpdateForm = ({ status }: any) => {
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!data.ok) {
        throw new Error('Failed to update form data');
      }

      return data.json();
    },
  });
  const params = useParams();
  const { data: customerInfoData } = useQuery({
    queryKey: ['customerInfo', params?.customerId],
    queryFn: async () => {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/${params?.customerId}?status=${status}`
      );

      if (!data.ok) {
        throw new Error('Error');
      }

      return data.json();
    },
    enabled:
      (!!params?.customerId && status === 'unauthenticated') ||
      (!!params?.customerId && status === 'authenticated'),
    retry: false,
  });

  const form = useForm<z.infer<typeof CustomerVehicleServiceUpdateFormSchema>>({
    resolver: zodResolver(CustomerVehicleServiceUpdateFormSchema),
    defaultValues: {
      customerName: '',
      customerSurname: '',
      customerPhone: '',
      customerVehicle: '',
      customerVehicleKM: '',
      customerVehicleNumber: '',
      experName: '',
      experPhone: '',
      experMail: '',
    },
  });

  const onSubmit = (
    values: z.infer<typeof CustomerVehicleServiceUpdateFormSchema>
  ) => {
    console.log({ ...values, customerId: params?.customerId });
    mutation.mutate({ ...values, customerId: params?.customerId });
  };

  useEffect(() => {
    if (customerInfoData) {
      form.reset({
        customerName: customerInfoData?.data.customer.customerName || '',
        customerSurname: customerInfoData?.data.customer.customerSurname || '',
        customerPhone: customerInfoData?.data.customer.customerPhone || '',
        customerVehicle: customerInfoData?.data.customer.customerVehicle || '',
        customerVehicleKM:
          customerInfoData?.data.customer.customerVehicleKM || '',
        customerVehicleNumber:
          customerInfoData?.data.customer.customerVehicleNumber || '',
        experName: customerInfoData?.data.customer?.experName || '',
        experPhone: customerInfoData?.data.customer?.experPhone || '',
        experMail: customerInfoData?.data.customer?.experMail || '',
      });
    }
  }, [customerInfoData, form]);

  if (customerInfoData)
    return (
      <div className="mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data, event) => {
              onSubmit(data);
            })}
          >
            <div className="space-y-4">
              {mutation.error && (
                <FormError message={(mutation.error as any).message} />
              )}
              {mutation.isSuccess && (
                <FormSuccess message={(mutation.data as any).message} />
              )}
              <FormField
                name="customerName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müşteri Adı</FormLabel>
                    <FormControl>
                      <Input
                        disabled={mutation.isPending}
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="customerSurname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müşteri Soyismi</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="customerPhone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müşteri Telefonu</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="customerVehicle"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Araç Markası</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="customerVehicleKM"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Araç Teslim Kilometre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="customerVehicleNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Araç Plaka</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="experName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exper Adı</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="experPhone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exper Telefon</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="experMail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exper Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={mutation.isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!mutation.isSuccess && (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  Aracı Güncelle
                </Button>
              )}

              {mutation.isSuccess && (
                <Link
                  href={`/customer/customer-detail/${(mutation.data as any).data?.customerId}`}
                >
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full mt-4"
                    disabled={mutation.isPending}
                  >
                    Müşterinin dosyasına git
                  </Button>
                </Link>
              )}
            </div>
          </form>
        </Form>
      </div>
    );
};

export default CustomerServiceUpdateForm;
