"use client"

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation'
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery} from "@tanstack/react-query";
import * as z from "zod";
import {CustomerVehicleServiceAddFormSchema} from "@/schemas";
import {Form} from "@/components/ui/form";
import Webcam from "react-webcam";

import Camera,{FACING_MODES} from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import {Dialog, DialogContent, DialogTrigger, DialogClose} from "@/components/ui/dialog";
import {Card, CardContent} from "@/components/ui/card";

const CustomerFile = () => {
    function handleTakePhoto (dataUri:any) {
        // Do stuff with the photo...
        console.log('takePhoto');
    }
    const params = useParams();
    const [file, setFile] = useState()
    const [mode, setMode] = useState(FACING_MODES.ENVIRONMENT)
    const {data, isSuccess} = useQuery({
        queryKey: ['customerInfo', params?.fileId],
        queryFn: async () => {
            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/${params?.fileId}`)
            return data.json()
        },
        enabled: !!params?.fileId,
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
        }
    })


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
            filePath: data.data.filePath
        });
    };

     return (
            <div className="mt-5">
                {mutation.isSuccess && "Başarılı"}
                {mutation.isError && "Error"}
                <div className="flex justify-between items-center space-y-1">
                    <div>
                        <h4 className="text-sm font-medium leading-none">
                            {data?.data?.customer?.customerName + " " + data?.data?.customer?.customerSurname}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {
                                data?.data?.customer?.customerVehicle
                                + " • " +
                                Intl.NumberFormat("tr-TR", {maximumSignificantDigits: 3})
                                    .format(data?.data?.customer?.customerVehicleKM || 0)
                                + " KM"
                            }
                        </p>
                    </div>
                </div>
                <Separator className="my-4"/>
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <div>Fotoğraflar</div>
                    <Separator orientation="vertical"/>
                    <div>Dokümanlar</div>
                </div>

                <form>
                    <input onChange={handleUploadLocalFile} type="file" accept=".png, .jpg, .jpeg"/>

                    <Button onClick={handleUploadS3}>
                        Fotoğraf Ekle
                    </Button>
                </form>

                <Card>
                    <CardContent className="absolute p-0 top-0">
                        <Button className={"absolute"} onClick={()=>setMode(FACING_MODES.ENVIRONMENT as any)}>
                            Kamerayı Çevir
                        </Button>
                        <Camera
                            idealFacingMode={mode}
                            isFullscreen
                            idealResolution={{width: 300, height:4600}}
                            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                        />
                    </CardContent>
                </Card>

                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>

                    <DialogContent className={"h-60"}>
                        <Button onClick={()=>setMode(FACING_MODES.ENVIRONMENT as any)}>
                            Kamerayı Çevir
                        </Button>
                        <Camera
                            idealFacingMode={mode}
                            isFullscreen
                            idealResolution={{width: 900, height:1600}}
                            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                        />
                    </DialogContent>

                </Dialog>


            </div>
        );

};

export default CustomerFile;