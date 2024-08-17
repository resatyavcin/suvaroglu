"use client"

import {Button} from "@/components/ui/button";
import {IoCloudDownload, IoShareSocial, IoTrash} from "react-icons/io5";
import {useCustomerStore} from "@/store";

const CustomerActions = () => {
    const { isViewActionButtons, setIsOpenAlertDialogComponent } = useCustomerStore();

    return (
        <div className={"mb-3 mr-3"}>
            {
                isViewActionButtons &&
                <div className={"gap-x-1.5 flex items-center justify-end w-full"}>
                    <Button variant={"default"} onClick={()=>{
                        setIsOpenAlertDialogComponent()
                    }}>
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
    );
};

export default CustomerActions;