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
        <Card className="m-7">
            <CardContent className="w-full">
                {
                    dataUri ?
                        <div className="flex flex-col justify-between items-center w-full">
                            <img width={190} height={350} src={dataUri} alt={"screenshot"}/>

                            <div className={"flex justify-between gap-x-1.5 mt-6"}>
                                <Button>
                                    Fotoğrafı yükle
                                </Button>
                                <Button onClick={() => setDataUri(undefined)}>
                                    İptal et
                                </Button>
                            </div>

                        </div> :
                        <Camera
                            idealFacingMode={mode}
                            imageType={IMAGE_TYPES.JPG}
                            imageCompression={0.97}
                            isMaxResolution={true}
                            onTakePhoto={(dataUri) => {
                                handleTakePhoto(dataUri);
                            }}
                        />
                }
            </CardContent>
        </Card>
    )
};

export default CameraMode;