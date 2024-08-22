"use client"

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation'
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Input} from "@/components/ui/input";
import { IoCameraSharp } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import Link from "next/link";
import {PhotoProvider, PhotoSlider, PhotoView} from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import {useCustomerStore} from "@/store";
const CustomerFile = () => {

    const params = useParams();
    const [file, setFile] = useState()
    const [medias, setMedias] = useState([])
    const [openMediaTunnel, setOpenMediaTunnel] = useState(false)
    const {setFilePath} = useCustomerStore()

    const {data: customerInfoData, isSuccess} = useQuery({
        queryKey: ['customerInfo', params?.fileId],
        queryFn: async () => {
            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/${params?.fileId}`)
            return data.json()
        },
        enabled: !!params?.fileId
    })


    const mutation = useMutation({
        mutationFn: async (values:any) => {

            const form_data = new FormData();
            for ( let key in values ) {
                form_data.append(key, values[key]);
            }

            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file`, {
                method: "POST",
                body: form_data
            })

            return data.json()
        },
        onSuccess:()=>{
            setFile(undefined)
        }
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
        if(customerInfoData && medias.length === 0){
            mediaMutation.mutate({filePath: customerInfoData.data.filePath})
            setFilePath(customerInfoData.data.filePath)
        }
    }, [customerInfoData]);


    useEffect(() => {
        if(mediaMutation.isSuccess){
            setMedias(mediaMutation.data.data)
        }
    }, [mediaMutation.isSuccess]);

    useEffect(() => {
        if(customerInfoData){
            mediaMutation.mutate({filePath: customerInfoData.data.filePath})
        }
    }, [mutation.isSuccess]);



    const handleUploadLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.target.files) return;
        setFile(e.target.files[0] as any);
    };

    const handleUploadS3 = async (e: any) => {
        if (!file) return;
        e.preventDefault();

        mutation.mutate({
            file,
            filePath: customerInfoData.data.filePath
        });
    };

     return (
            <div className="mt-5">
                <div className="mb-5">
                    {mutation.error && <FormError message={(mutation.error.message as any)}/> }
                    {mutation.isSuccess && <FormSuccess message={(mutation.data.message as any)}/> }
                </div>

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
                        <Button className="mr-4" onClick={()=>setOpenMediaTunnel(true)}>
                            <IoMdImage />
                        </Button>

                        <Link href={`/camera-mode?fileId=${params?.fileId}`}>
                            <Button>
                                <IoCameraSharp />
                            </Button>
                        </Link>
                    </div>
                </div>
                <Separator className="my-4"/>

                <form className="mt-6">
                    <Input onChange={handleUploadLocalFile} type="file" accept=".png, .jpg, .jpeg"/>

                    {
                        file &&  <Button onClick={handleUploadS3} className="mt-2.5">
                            Dosyayı Ekle
                        </Button>
                    }
                </form>

                <PhotoSlider
                    speed={()=>10}
                    images={medias.map((item) => ({ src: item, key: item }))}
                    visible={openMediaTunnel}
                    onClose={() => setOpenMediaTunnel(false)}
                />

            </div>
        );

};

export default CustomerFile;