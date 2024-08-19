"use client"

import React, {useEffect} from 'react';
import CustomerServiceAddForm from "@/components/customer/customer-service-add-form";


export default function CustomerAdd(props:any) {

    useEffect(() => {
        props.setTitle("Servis Aracı Ekle")
    }, []);

    return (
        <div>
            <CustomerServiceAddForm/>
        </div>
    );
};
