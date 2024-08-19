"use client"

import * as z from 'zod'

import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from "@/components/ui/input";

import {CustomerVehicleServiceAddFormSchema} from '@/schemas'
import {useRouter} from 'next/navigation'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { useState, useTransition} from "react";
import {serviceAdd} from "@/actions/serviceAdd";

const CustomerServiceAddForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState("")

    const form = useForm<z.infer<typeof CustomerVehicleServiceAddFormSchema>>({
        resolver: zodResolver(CustomerVehicleServiceAddFormSchema),
        defaultValues: {
            customerName: "",
            customerSurname: "",
            customerVehicle: "",
            customerVehicleKM: ""
        }
    })

    const router = useRouter()


    const onSubmit = (values: z.infer<typeof CustomerVehicleServiceAddFormSchema>) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            await serviceAdd(values).then((data) => {
                setSuccess(data.success);
                setError(data.error)
                router.push("/")
            });
        });
    }

    return (
           <div className="mt-6">
               <Form {...form}>
                   <form onSubmit={form.handleSubmit((data, event) => {
                       onSubmit(data);
                   })} className="space-y-6">
                       <div className="space-y-4">
                           <FormError message={error}/>
                           <FormSuccess message={success}/>
                           <FormField
                               name="customerName"
                               control={form.control}
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>Müşteri Adı</FormLabel>
                                       <FormControl>
                                           <Input disabled={isPending} {...field}
                                                  type="text"/>
                                       </FormControl>
                                       <FormMessage/>
                                   </FormItem>
                               )}
                           />

                           <FormField
                               name="customerSurname"
                               control={form.control}
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>Müşteri Soyismi</FormLabel>
                                       <FormControl>
                                           <Input {...field} type="text"/>
                                       </FormControl>
                                       <FormMessage/>
                                   </FormItem>
                               )}
                           />


                           <FormField
                               name="customerVehicle"
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className="flex flex-col">
                                       <FormLabel>Araç Markası</FormLabel>
                                       <FormControl>
                                           <Input {...field} type="text"/>
                                       </FormControl>
                                       <FormMessage/>
                                   </FormItem>
                               )}
                           />

                           <FormField
                               name="customerVehicleKM"
                               control={form.control}
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>Araç Teslim Kilometre</FormLabel>
                                       <FormControl>
                                           <Input {...field} type="number"/>
                                       </FormControl>
                                       <FormMessage/>
                                   </FormItem>
                               )}
                           />



                       </div>
                       <Button type="submit" className="w-full" disabled={isPending}>
                           Aracı Ekle
                       </Button>
                   </form>
               </Form>
           </div>
    )
}

export default CustomerServiceAddForm