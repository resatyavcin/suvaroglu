"use client"

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation'
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {PhotoProvider, PhotoView} from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import {useCustomerStore} from "@/store";
import { BsSpeedometer } from "react-icons/bs";
import CustomerFolders from "@/components/customer/customer-folders";

const CustomerFile = () => {

    const params = useParams();
    const {setFilePath, setFileName} = useCustomerStore();
    const [verifyContentMedia, setVerifyContentMedia] = useState<any>(undefined)

    const {data: customerInfoData, isSuccess} = useQuery({
        queryKey: ['customerInfo', params?.fileId],
        queryFn: async () => {
            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/${params?.fileId}`)
            return data.json()
        },
        enabled: !!params?.fileId
    })

    const mediaMutation = useMutation({
        mutationFn: async (values:any) => {
            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medias`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            return data.json()
        },
    })


    useEffect(() => {
        if(customerInfoData){
            mediaMutation.mutate({filePath: customerInfoData.data.filePath})
            setFilePath(customerInfoData.data.filePath)
            localStorage.setItem("defaultpath", customerInfoData.data.filePath)
            setFileName("")
        }
    }, [customerInfoData]);


    useEffect(() => {
        if(mediaMutation.isSuccess){
            const verifyContents:any[] = mediaMutation.data.data.filter((item:any, index:number) => (item.name as string).includes("verifyKM"))[0]
            if(verifyContents){
                setVerifyContentMedia(verifyContents as any)
            }
        }
    }, [mediaMutation.isSuccess]);


    return (
        <div className="mt-5">

            <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                    <h4 className="text-sm font-medium leading-none">
                        {customerInfoData?.data?.customer?.customerName + " " + customerInfoData?.data?.customer?.customerSurname}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        {
                            customerInfoData?.data?.customer?.customerVehicle
                            + " • " +
                            Intl.NumberFormat("tr-TR", {maximumSignificantDigits: 3})
                                .format(customerInfoData?.data?.customer?.customerVehicleKM || 0)
                            + " KM"
                        }
                    </p>
                </div>

                <div>

                    {
                        verifyContentMedia ?
                            <PhotoProvider>
                                <PhotoView src={verifyContentMedia?.url || ""}>
                                    <Button className="mr-4 bg-green-600">
                                        <BsSpeedometer/>
                                    </Button>
                                </PhotoView>
                            </PhotoProvider> :

                            <Link href={`/camera-mode?fileId=${params?.fileId}`}>
                                <Button className="mr-4 bg-red-800" onClick={() => setFileName("verifyKM.jpeg")}>
                                    <BsSpeedometer/>
                                </Button>
                            </Link>

                    }

                </div>
            </div>
            <Separator className="my-4"/>

            <CustomerFolders/>
        </div>
    );

};

export default CustomerFile;