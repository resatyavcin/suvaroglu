"use client"

import * as React from "react"

import CustomerTable from "@/components/customer/customer-table";

import {Button} from "@/components/ui/button";
import { IoAddSharp } from "react-icons/io5";
import {Drawer, DrawerTrigger, DrawerContent} from "@/components/ui/drawer";
import {useCustomerStore} from "@/store";
import { IoTrash } from "react-icons/io5";
import { IoCloudDownload } from "react-icons/io5";
import { IoShareSocial } from "react-icons/io5";
import { useClickAway } from "@uidotdev/usehooks";
import {useEffect, useState} from "react";
import {CustomerAlertDialog} from "@/components/customer/customer-alert";

export default function Home() {
    const { selectedCustomersCount,selectedCustomers, deleteCustomers } = useCustomerStore();
    const [isOpenAlertDialogComponent, setIsOpenAlertDialogComponent] = useState(false)
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
              onApprove={()=>{setIsOpenAlertDialogComponent(false)}}
              onCancel={()=>{setIsOpenAlertDialogComponent(false)}}
              isOpen={isOpenAlertDialogComponent}
          />
          <div className="w-full">
              <div className={"mb-3 mr-3"}>
                  {
                      selectedCustomersCount > 0 &&
                      <div className={"gap-x-1.5 flex items-center justify-end w-full"}>
                          <Button variant={"default"} onClick={()=>setIsOpenAlertDialogComponent(true)}>
                              <IoTrash className="w-4 h-4"/>
                          </Button>

                          <Button variant={"default"}>
                              <IoCloudDownload className="w-4 h-4"/>
                          </Button>

                          <Button variant={"default"}>
                              <IoShareSocial className="w-4 h-4"/>
                          </Button>
                      </div>
                  }
              </div>
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
