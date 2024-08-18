"use client"

import {Button} from "@/components/ui/button";
import {IoCloudDownload, IoShareSocial, IoTrash} from "react-icons/io5";
import {useCustomerStore} from "@/store";

const CustomerActions = () => {
    const { isViewActionButtons, setIsOpenAlertDialogComponent } = useCustomerStore();

    return (
        <div className={"mr-3"}>
            {
                isViewActionButtons &&
                <div className={"gap-x-1.5 flex items-center justify-end w-full"}>
                    <Button onClick={()=>{
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