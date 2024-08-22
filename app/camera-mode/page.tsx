"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Camera, {FACING_MODES,IMAGE_TYPES} from "react-html5-camera-photo";
import {useState} from "react";

import 'react-html5-camera-photo/build/css/index.css';
import Image from "next/image";


const CameraMode = () => {
    const [mode, setMode] = useState(FACING_MODES.ENVIRONMENT);
    const [dataUri, setDataUri] = useState<any>()

    const handleTakePhoto = (data:any) => {
        setDataUri(data)
    }

    return (
        <Card className="w-full">
            <CardContent className="w-full p-0 bg-black">
                {
                    dataUri ?
                            <div>
                                <Button className="absolute z-50 bottom-0 right-0">
                                    Fotoğrafı yükle
                                </Button>
                                <Button onClick={()=>setDataUri(undefined)} className="absolute z-50 top-0 right-0">
                                    İptal et
                                </Button>
                            <img src={dataUri} alt={"screenshot"}/>
                        </div> :
                        <Camera
                            isFullscreen={true}
                            idealFacingMode={mode}
                            idealResolution={{width: 840, height:480}}
                            imageType = {IMAGE_TYPES.JPG}
                            imageCompression = {0.97}
                            isMaxResolution = {true}
                            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                    />
                }
            </CardContent>
        </Card>
    )
};

export default CameraMode;