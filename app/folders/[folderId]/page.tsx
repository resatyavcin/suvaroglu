"use client"

import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PhotoProvider, PhotoView} from "react-photo-view";
import {useMutation} from "@tanstack/react-query";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import {FaDownload, FaFile, FaFileArrowUp, FaShare} from "react-icons/fa6";
import {useCustomerStore} from "@/store";
import {useParams} from "next/navigation";
import {IoCameraSharp} from "react-icons/io5";
import Link from "next/link";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {downloadFiles} from "@/actions/downloaFiles";
import {FaFileArchive} from "react-icons/fa";
import {DeleteIcon} from "lucide-react";
import {AiFillDelete} from "react-icons/ai";
import {MdDelete} from "react-icons/md";


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

    const mutationDelete = useMutation({
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
                method: "DELETE",
                body: form_data
            })

            return data.json()
        }
    })

    const urlToObject = async (url:string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            return new File([blob], 'image.png', { type: blob.type });
        } catch (error) {
            console.error('Dosya indirilemedi:', error);
            throw error;
        }
    };

    const download = async (urls:string[]) => {

        for (const url of urls) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = url.split('/').pop() || "";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error) {
                console.error('İndirme hatası:', error);
            }
        }

    }

    const handleDownloadButton = async (urls:string[]) => {

        if (urls.length > 0) {
            try {

                await download(urls);

                console.log('Başarılı İndirme');
            } catch (error) {
                console.error('Paylaşım hatası:', error);
            }
        } else {
            console.log('Bu tarayıcı paylaşımı desteklemiyor.');
        }
    }




    const handleShareButton = async (urls:string[]) => {

        if (navigator.share && urls.length > 0) {
            try {

                const filePaths = [];

                for (let x = 0; x < urls.length; x++) {
                    const file = await urlToObject(urls[x]);

                    filePaths.push(file)
                }

                const data = {
                    files: filePaths
                };

                await navigator.share(data);
                console.log('Başarılı paylaşım');
            } catch (error) {
                console.error('Paylaşım hatası:', error);
            }
        } else {
            console.log('Bu tarayıcı paylaşımı desteklemiyor.');
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
    }, [mutation.isSuccess, mutationDelete.isSuccess]);


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

    const handleDeleteS3 = async (urls: string[]) => {
        if (urls && urls.length === 0) return;
        mutationDelete.mutate({
            file: urls,
            filePath: (localStorage.getItem("defaultpath") || "") + `${params?.folderId}/`
        });
    };


    return (
        <div>
            <h4 className="font-bold leading-none mt-5">
                {folders?.find(({folderPath}) => folderPath.slice(1) === params?.folderId)?.folderName}
            </h4>

            <div className={"flex justify-between items-center"}>
                <div className={"my-4"}>

                    {
                        selectedFiles.length > 0 &&
                        <Button className="mr-4" onClick={() => handleShareButton(selectedFiles)}>
                            <FaShare/>
                        </Button>
                    }

                    {selectedFiles.length > 0 &&
                        <Button className="mr-4" onClick={() => handleDownloadButton(selectedFiles)}>
                            <FaDownload/>
                        </Button>}

                    <Button className="mr-4" onClick={()=>handleDeleteS3(selectedFiles)}>
                        <MdDelete />
                    </Button>


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


            <div className="my-2">
                {mutation.isError && <FormError message={(mutation.error.message as any)}/>}
                {mutation.isSuccess && <FormSuccess message={(mutation.data.message as any)}/>}

                {mutationDelete.isError && <FormError message={(mutationDelete.error.message as any)}/>}
                {mutationDelete.isSuccess && <FormSuccess message={(mutationDelete.data.message as any)}/>}
            </div>
            <form className="mt-2">
                {openFileUpload &&
                    <Input multiple={true} className={file ? "mt-3" : "my-3"} onChange={handleUploadLocalFile}
                           type="file" accept=".png, .jpg, .jpeg, .pdf"/>}

                {
                    file && <Button onClick={handleUploadS3} className="mt-3 mb-6">
                        Dosyayı Ekle
                    </Button>
                }
            </form>

            <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="photos">Fotoğraflar</TabsTrigger>
                    <TabsTrigger value="file">Dosyalar</TabsTrigger>
                </TabsList>
                <TabsContent value="photos">
                    <div className="grid grid-cols-2 grid-rows-4 gap-6 mt-6">
                        {
                            <PhotoProvider>
                                {
                                    medias?.filter((item: any) => !item.name.includes("verifyKM") && !(item.name as string).includes(".pdf")).map((item: any, i) => {
                                        return <PhotoView src={item.url} key={i}>
                                            <div className={"flex gap-x-1"}>
                                                <Checkbox
                                                    className="w-6 h-6 rounded-full"
                                                    onCheckedChange={(value) => {
                                                        setSelectedFiles([...selectedFiles, item.url])
                                                    }}
                                                />
                                                <img width={"80%"} src={item.url} alt=""/>
                                            </div>
                                        </PhotoView>
                                    })
                                }
                            </PhotoProvider>
                        }
                    </div>
                </TabsContent>
                <TabsContent value="file">
                    {
                        medias?.filter((item: any) => !item.name.includes("verifyKM") && (item.name as string).includes(".pdf")).map((item: any, i) => {
                            return <div key={i}>
                                <Checkbox
                                    className="w-6 h-6 rounded-full"
                                    onCheckedChange={(value) => {
                                        setSelectedFiles([...selectedFiles, item.url])
                                    }}
                                />
                                <FaFile className={"w-12 h-12"} key={i}/>
                            </div>
                        })
                    }
                </TabsContent>
            </Tabs>


        </div>
    );
};

export default FolderPage;