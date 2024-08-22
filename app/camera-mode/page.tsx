"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Camera, {IMAGE_TYPES} from "react-html5-camera-photo";
import {Suspense, useState} from "react";

import 'react-html5-camera-photo/build/css/index.css';
import {useRouter, useSearchParams, useParams, usePathname} from "next/navigation";



function UploadButton() {
    const searchParams = useSearchParams()
    const {push} = useRouter();

    const handleUploadPhoto = (searchParam:any) => {
        push(`/customer/customer-detail/${searchParam.get("fileId")}`)
    }

    return <Button className="flex-1" onClick={()=>handleUploadPhoto(searchParams)}>
        Fotoğrafı yükle
    </Button>
}

const CameraMode = () => {
    const [dataUri, setDataUri] = useState<any>()

    const handleTakePhoto = (data:any) => {
        setDataUri(data)
    }

    return (
        <Suspense fallback={null}>
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
                                    <UploadButton/>
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
        </Suspense>
    )
};

export default CameraMode;