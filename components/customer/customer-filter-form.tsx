'use client';

import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

const CustomerFilterForm = ({ setFilterValues, refetch }: any) => {
  const form = useForm({
    defaultValues: {
      customerName: '',
      customerVehicleNumber: '',
    },
  });

  const onSubmit = (values: any) => {
    setFilterValues(values);
    refetch();
  };

  return (
    <div>
      <div className="my-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data, event) => {
              onSubmit(data);
            })}
          >
            <div className="flex">
              <FormField
                name="customerName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder={'Ad'} type="search" />
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
                    <FormControl>
                      <Input placeholder={'Plaka'} {...field} type="search" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full flex-1">
                Ara
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomerFilterForm;
