"use client"

import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PhotoProvider, PhotoView} from "react-photo-view";
import {useMutation} from "@tanstack/react-query";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import {FaFileArrowUp} from "react-icons/fa6";
import {useCustomerStore} from "@/store";
import {useParams} from "next/navigation";
import {IoCameraSharp} from "react-icons/io5";
import Link from "next/link";



const FolderPage = () => {
    const [file, setFile] = useState()
    const [openFileUpload, setOpenFileUpload] = useState(false)
    const [medias, setMedias] = useState([])

    const {filePath, setFilePath,folders} = useCustomerStore();
    const params = useParams();

    const mutation = useMutation({
        mutationFn: async (values:any) => {

            console.log(values)

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
        mediaMutation.mutate({filePath: localStorage.getItem("defaultpath") + `${params?.folderId}`})
    }, []);


    useEffect(() => {
        if(mediaMutation.isSuccess){
            setMedias(mediaMutation.data.data)
            setFilePath(localStorage.getItem("defaultpath") + `${params?.folderId}/`)
        }
    }, [mediaMutation.isSuccess]);

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
            filePath: (localStorage.getItem("defaultpath") || "") + `${params?.folderId}/`
        });
    };


    return (
        <div>
            <div className={"flex justify-between items-center"}>
                <h4 className="font-bold leading-none">
                    {folders?.find(({folderPath})=> folderPath.slice(1)===params?.folderId)?.folderName}
                </h4>


                <div className={"my-4"}>
                    <Button className="mr-4" onClick={() => setOpenFileUpload(!openFileUpload)}>
                        <FaFileArrowUp/>
                    </Button>


                    <Link href={`/camera-mode?folderId=${params?.folderId}`}>
                        <Button>
                            <IoCameraSharp/>
                        </Button>
                    </Link>
                </div>

            </div>


            <div className="my-5">
                {mutation.isError && <FormError message={(mutation.error.message as any)}/>}
                {mutation.isSuccess && <FormSuccess message={(mutation.data.message as any)}/>}
            </div>

            <form className="mt-6">
                {openFileUpload &&
                    <Input multiple={true} className={file ? "mt-3" : "my-3"} onChange={handleUploadLocalFile}
                           type="file" accept=".png, .jpg, .jpeg, .pdf"/>}

                {
                    file && <Button onClick={handleUploadS3} className="mt-3 mb-6">
                        Dosyayı Ekle
                    </Button>
                }
            </form>

            <div className="grid grid-cols-3 grid-rows-4 gap-4">
                {
                    <PhotoProvider>
                        {
                            medias?.filter((item: any) => !item.name.includes("verifyKM") && !(item.name as string).includes(".pdf")).map((item: any, i) => {
                                return <PhotoView src={item.url} key={i}>
                                    <img src={item.url} alt=""/>
                                </PhotoView>
                            })
                        }
                    </PhotoProvider>
                }
            </div>

        </div>
    );
};

export default FolderPage;