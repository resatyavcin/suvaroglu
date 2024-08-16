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
import {useEffect} from "react";

export default function Home() {
    const { selectedCustomersCount } = useCustomerStore();

    const [isOpen, setIsOpen] = React.useState(false);
    const ref = useClickAway(() => {
        setIsOpen(true);
    });

    useEffect(() => {
        setIsOpen(false)
    }, [isOpen]);


    return (
      <Drawer>
          <div className="w-full">
              <div className={"mb-3 mr-3"}>
                  {
                      selectedCustomersCount > 0 &&
                      <div className={"gap-x-1.5 flex items-center justify-end w-full"}>
                          <Button variant={"default"}>
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
              <div className="rounded-md border" ref={ref}>
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
