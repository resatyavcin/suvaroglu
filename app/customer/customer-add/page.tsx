"use client"

import React, {useEffect} from 'react';
import CustomerServiceAddForm from "@/components/customer/customer-service-add-form";

interface CustomerAddPageProps {
    setTitle: (value: string) => void;
}

const CustomerAdd = ({setTitle}:CustomerAddPageProps) => {

    useEffect(() => {
        setTitle("Servis Aracı Ekle")
    }, []);

    return (
        <div>
            <CustomerServiceAddForm/>
        </div>
    );
};

export default CustomerAdd;