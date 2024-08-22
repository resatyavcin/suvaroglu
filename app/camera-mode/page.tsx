"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Camera, {IMAGE_TYPES} from "react-html5-camera-photo";
import {useState} from "react";

import 'react-html5-camera-photo/build/css/index.css';
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";


const CameraMode = () => {
    const {push} = useRouter();
    const searchParam = useSearchParams();
    const [dataUri, setDataUri] = useState<any>()

    const handleTakePhoto = (data:any) => {
        setDataUri(data)
    }

    const handleUploadPhoto = () => {
        const fileId = searchParam.get("fileId")
        push(`/customer/customer-detail/${fileId}`)
    }

    return (
        <Card className="m-7">
            <CardHeader className="pt-0"/>
            <CardContent className="h-full w-full">
                {
                    dataUri ?
                        <div className="flex flex-col justify-between items-center w-full">
                            <img src={dataUri} alt={"screenshot"}/>

                            <div className={"flex justify-between gap-x-1.5 mt-6 w-full"}>
                                <Button variant="destructive" onClick={() => setDataUri(undefined)}>
                                    İptal et
                                </Button>
                                <Button className="flex-1" onClick={handleUploadPhoto}>
                                    Fotoğrafı yükle
                                </Button>
                            </div>

                        </div> :
                        <Camera
                            idealFacingMode={"environment"}
                            imageType={IMAGE_TYPES.JPG}
                            imageCompression={0.25}
                            isMaxResolution={true}
                            onTakePhotoAnimationDone = { (dataUri) => { handleTakePhoto(dataUri); } }

                        />
                }
            </CardContent>
        </Card>
    )
};

export default CameraMode;