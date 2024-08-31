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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Checkbox} from "@/components/ui/checkbox";


const FolderPage = () => {
    const [file, setFile] = useState()
    const [openFileUpload, setOpenFileUpload] = useState(false)
    const [medias, setMedias] = useState([])

    const {filePath, setFilePath,folders} = useCustomerStore();
    const [selectedFiles, setSelectedFiles] = useState<any[]>([])

    const params = useParams();

    const mutation = useMutation({
        mutationFn: async (values:any) => {
            const form_data = new FormData();

            for ( let key in values ) {
                if(key !== "file") {
                    form_data.append(key, values[key]);
                }
            }

            for (var x = 0; x < values.file.length; x++) {
                form_data.append("file[]", values.file[x]);
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


    function createFileList(files: File[]) {
        const dataTransfer = new DataTransfer();

        files.forEach(file => {
            dataTransfer.items.add(file);
        });

        return dataTransfer.files;
    }


    const urlToObject= async(url:any)=> {
        const response = await fetch(url);
        const blob = await response.blob();

        return new File([blob], 'image.png', {type: blob.type});
    }

    const handleShareButton = async (urls: string[]) => {

        console.log(urls);
        if(selectedFiles.length > 0) {

            const arr = []

            for (let i = 0; i < urls.length; i++) {
                arr.push(await urlToObject(urls[i]))
            }

            console.log(arr);

            const data = {
                files: arr
            };
            navigator.share(data).then(() => {
                console.log('Successful share');
            }).catch((error) => {
                console.log('Error sharing:', error);
            });

        }
    }

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
        setFile(e.target.files as any);
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
            <Button onClick={()=>handleShareButton(selectedFiles as any)}>
                Share
            </Button>

            <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="photos">Fotoğraflar</TabsTrigger>
                    <TabsTrigger value="file">Dosyalar</TabsTrigger>
                </TabsList>
                <TabsContent value="photos">
                    <div className="grid grid-cols-3 grid-rows-4 gap-4 mt-6">
                        {
                            <PhotoProvider>
                                {
                                    medias?.filter((item: any) => !item.name.includes("verifyKM") && !(item.name as string).includes(".pdf")).map((item: any, i) => {
                                        return <>
                                            <Checkbox
                                                className="w-6 h-6 rounded-full"
                                                // checked={}
                                                onCheckedChange={(value) => {
                                                    console.log(value)
                                                    setSelectedFiles([...selectedFiles, item.url])
                                                }}
                                            />
                                            <PhotoView src={item.url} key={i}>
                                                <img src={item.url} alt=""/>
                                            </PhotoView>
                                        </>
                                    })
                                }
                            </PhotoProvider>
                        }
                    </div>
                </TabsContent>
                <TabsContent value="file">

                </TabsContent>
            </Tabs>


        </div>
    );
};

export default FolderPage;