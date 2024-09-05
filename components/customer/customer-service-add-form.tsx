'use client';

import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';

import { CustomerVehicleServiceAddFormSchema } from '@/schemas';

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
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';

const CustomerServiceAddForm = () => {
  const mutation = useMutation({
    mutationFn: async (
      values: z.infer<typeof CustomerVehicleServiceAddFormSchema>
    ) => {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!data.ok) {
        throw new Error('Failed to add form data');
      }

      return data.json();
    },
  });

  const form = useForm<z.infer<typeof CustomerVehicleServiceAddFormSchema>>({
    resolver: zodResolver(CustomerVehicleServiceAddFormSchema),
    defaultValues: {
      customerName: '',
      customerSurname: '',
      customerVehicle: '',
      customerVehicleKM: '',
      customerVehicleNumber: '',
    },
  });

  const onSubmit = (
    values: z.infer<typeof CustomerVehicleServiceAddFormSchema>
  ) => {
    mutation.mutate(values);
  };

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

            {!mutation.isSuccess && (
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                Aracı Ekle
              </Button>
            )}

            {mutation.isSuccess && (
              <Link
                href={`/customer/customer-detail/${(mutation.data as any).data}`}
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

export default CustomerServiceAddForm;
