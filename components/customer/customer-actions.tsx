"use client"

import {Button} from "@/components/ui/button";
import {IoCloudDownload, IoShareSocial, IoTrash} from "react-icons/io5";
import {useCustomerStore} from "@/store";
import {CustomerAlertDialog} from "@/components/customer/customer-alert";
import * as React from "react";

const CustomerActions = () => {
    const { isViewActionButtons, setIsOpenAlertDialogComponent, isOpenAlertDialogComponent, deleteCustomers, selectedCustomers } = useCustomerStore();



    return (
        <div className={"mr-3"}>

            <CustomerAlertDialog
                title={"Emin misin?"}
                description={"Seçtiğiniz kayıtlar silinecektir. Geri alnımaz. Silmek istediğinizden emin misiniz?"}
                okText={"Kalıcı olarak sil"}
                cancelText={"Vazgeç"}
                onApprove={() => {
                    setIsOpenAlertDialogComponent()
                    deleteCustomers(selectedCustomers ||[])
                }}
                onCancel={()=>{setIsOpenAlertDialogComponent()}}
                isOpen={isOpenAlertDialogComponent}
            />

            {
                isViewActionButtons &&
                <div className={"gap-x-1.5 flex items-center justify-end w-full"}>
                    <Button variant={"destructive"} onClick={()=>{
                        setIsOpenAlertDialogComponent()
                    }}>
                        <IoTrash className="w-4 h-4"/>
                    </Button>

                    <Button>
                        <IoCloudDownload className="w-4 h-4"/>
                    </Button>

                    <Button>
                        <IoShareSocial className="w-4 h-4"/>
                    </Button>
                </div>
            }
        </div>
    );
};

export default CustomerActions;