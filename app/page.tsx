"use client"

import * as React from "react"

import CustomerTable from "@/components/customer/customer-table";

import {Button} from "@/components/ui/button";
import { IoAddSharp } from "react-icons/io5";
import {Drawer, DrawerTrigger, DrawerContent} from "@/components/ui/drawer";
import { useClickAway } from "@uidotdev/usehooks";
import {useEffect, useState} from "react";
import {CustomerAlertDialog} from "@/components/customer/customer-alert";
import {useCustomerStore} from "@/store";

export default function Home() {
    const { setIsOpenAlertDialogComponent, isOpenAlertDialogComponent, deleteCustomers, selectedCustomers } = useCustomerStore()
    const [isOpen, setIsOpen] = React.useState(false);
    const ref:any = useClickAway(() => {
        setIsOpen(true);
    });

    useEffect(() => {
        setIsOpen(false)
    }, [isOpen]);

    return (
      <Drawer>
          <CustomerAlertDialog
              title={"Emin misin?"}
              description={"Seçtiğiniz kayıtlar silinecektir. Geri alnımaz. Silmek istediğinizden emin misiniz?"}
              okText={"Kalıcı olarak sil"}
              cancelText={"Vazgeç"}
              onApprove={()=>{
                  setIsOpenAlertDialogComponent()
                  deleteCustomers(selectedCustomers ||[])
              }}
              onCancel={()=>{setIsOpenAlertDialogComponent()}}
              isOpen={isOpenAlertDialogComponent}
          />
          <div className="w-full">
              <div ref={ref} className="rounded-md border">
                  <CustomerTable isOpen={isOpen} />
              </div>
          </div>
          <DrawerContent className="h-screen rounded-none"></DrawerContent>
          <DrawerTrigger asChild>
              <Button className="rounded-full w-14 h-14 fixed bottom-10 right-6 drop-shadow-md">
                  <IoAddSharp className="w-7 h-7"/>
              </Button>
          </DrawerTrigger>
      </Drawer>
  );
}
