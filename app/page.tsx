"use client"

import * as React from "react"

import CustomerTable from "@/components/customer/customer-table";

import {Button} from "@/components/ui/button";
import { IoAddSharp } from "react-icons/io5";
import { useClickAway } from "@uidotdev/usehooks";
import {useEffect} from "react";
import {CustomerAlertDialog} from "@/components/customer/customer-alert";
import {useCustomerStore} from "@/store";
import CustomerActions from "@/components/customer/customer-actions";

import Link from "next/link";
import {useQuery} from "@tanstack/react-query";

export default function Home() {

    const [isOpen, setIsOpen] = React.useState(false);

    const ref:any = useClickAway(() => {
        setIsOpen(true);
    });

    useEffect(() => {
        setIsOpen(false);
    }, [isOpen]);

    return (
        <div>
            <div className="flex items-center justify-between h-full my-5 mx-3">
                <h2 className="font-extrabold text-xl text-blue-500">Suvaroglu</h2>
                <CustomerActions/>
            </div>


                <div className="w-full">
                    <div ref={ref} className="rounded-md border">
                        <CustomerTable isOpen={isOpen} />
                    </div>
                </div>


                <Link href="/customer/customer-add">
                    <Button type="button" className="rounded-full w-14 h-14 fixed bottom-10 right-6 drop-shadow-md">
                        <IoAddSharp className="w-7 h-7"/>
                    </Button>
                </Link>

        </div>
  );
}
