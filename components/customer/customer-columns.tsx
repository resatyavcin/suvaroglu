"use client"

import {ColumnDef} from "@tanstack/react-table";
import {TCustomer} from "@/constants";
import {Checkbox} from "@/components/ui/checkbox";

type TCustomerColumn = (
        selectCustomers: (customer: string)=> void,
        unselectCustomers: (customer: string) => void,
        isSelectable: boolean,
        selectedCustomersCount: number
    ) => ColumnDef<TCustomer>[]

export const columns: TCustomerColumn = (selectCustomers, unselectCustomers, isSelectable,selectedCustomersCount) => ([
    {
        id: "customerId",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-x-3">
                    {isSelectable && <Checkbox
                            className="w-6 h-6 rounded-full"
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => {
                                row.toggleSelected(!!value)

                                if (value) {
                                    selectCustomers(row.original.customerId)
                                    return;
                                }
                                unselectCustomers(row.original.customerId);
                            }}
                            aria-label="Select row"
                        />
                    }
                    <div>
                        <h2 className="font-bold">
                            {row.original.customerName + ' ' + row.original.customerSurname}
                        </h2>
                        <p>
                            {row.original.customerVehicle + ' • ' + new Intl.NumberFormat('tr-TR', { style: "decimal" }).format(
                                row.original.customerVehicleKM)
                            } KM
                        </p>
                    </div>
                </div>
            )
        }
    }
])
