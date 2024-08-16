"use client"

import * as React from "react"

import CustomerTable from "@/components/customer/customer-table";

import customerData from '@/customer.json'
import {Button} from "@/components/ui/button";
import { IoAddSharp } from "react-icons/io5";
import {Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerOverlay} from "@/components/ui/drawer";
import { IoShareSocial } from "react-icons/io5";
import { IoSaveSharp } from "react-icons/io5";

export default function Home() {

  return (


      <Drawer noBodyStyles >
          <div className="w-full">
              <div className="rounded-md border">
                  <CustomerTable data={customerData?.db}/>
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
