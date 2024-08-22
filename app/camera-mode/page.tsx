"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Camera, {IMAGE_TYPES} from "react-html5-camera-photo";
import {Suspense, useEffect, useState} from "react";

import 'react-html5-camera-photo/build/css/index.css';
import {useRouter, useSearchParams, useParams, usePathname} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {useCustomerStore} from "@/store";



function UploadButton({file}:any) {
    const searchParams = useSearchParams()
    const {push} = useRouter();
    const {filePath} = useCustomerStore()

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

    const handleUploadPhoto = () => {

        mutation.mutate({
            file,
            filePath
        });
    }

    useEffect(() => {
        if(mutation.isSuccess){
            push(`/customer/customer-detail/${searchParams.get("fileId")}`);
        }
    }, [mutation.isSuccess]);


    return <button className="flex-1" onClick={handleUploadPhoto}>
        Fotoğrafı yükle
    </button>
}


const CameraMode = () => {
    const [dataUri, setDataUri] = useState<any>()
    const [file, setFile] = useState< File | undefined>(undefined)

    const handleTakePhoto = (data:any) => {
        setDataUri(data)

        fetch(data)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], `name-${Date.now()}.png`, { type: "image/png" })
                setFile(file)
            })
    }


    return (
        <Suspense fallback={null}>
            <Card className="m-7">
                <CardHeader className="pt-0">


                </CardHeader>
                <CardContent className="h-full w-full">
                    {
                        dataUri ?
                            <div className="flex flex-col justify-between items-center w-full">
                                <img src={dataUri} alt={"screenshot"}/>
                                <div className={"flex justify-between gap-x-1.5 mt-6 w-full"}>
                                    <Button variant="destructive" onClick={() => setDataUri(undefined)}>
                                        İptal et
                                    </Button>
                                    <UploadButton file={file}/>
                                </div>

                            </div> :
                            <Camera
                                idealFacingMode={"environment"}
                                imageType={IMAGE_TYPES.PNG}
                                imageCompression={0.25}
                                isMaxResolution={true}
                                onTakePhotoAnimationDone = { (dataUri) => { handleTakePhoto(dataUri); } }
                            />
                    }
                </CardContent>
            </Card>
        </Suspense>
    )
};

export default CameraMode;